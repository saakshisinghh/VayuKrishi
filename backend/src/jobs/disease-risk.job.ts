import { Worker, Job } from "bullmq";
import { Types, models, Model } from "mongoose";
import { createRedisConnection } from "../config/redis";
import { QUEUE_NAMES, diseaseQueue, JOB_SCHEDULES } from "./queue";
import { notificationService } from "../modules/notifications/services/notification.service";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "../modules/notifications/types/notification.types";

/**
 * disease-risk.job.ts — runs daily (see JOB_SCHEDULES.DISEASE_RISK).
 *
 * Responsibilities (per spec):
 *  - Analyze disease reports
 *  - Identify risk clusters
 *  - Generate warnings
 *
 * Expects Phase 6 (Disease Detection) to have a "DiseaseReport" model
 * and Phase 3 to have "Farm". A "cluster" here is operationalized as:
 * >= CLUSTER_THRESHOLD reports of the same disease in the same district
 * within the lookback window — simple, explainable, and cheap to compute
 * daily. Swap in a more sophisticated spatial-clustering algorithm later
 * without changing the alerting/notification side of this job.
 *
 * IMPORTANT — schema note:
 * The real DiseaseReport schema (Phase 6) does NOT store district or
 * diseaseName directly:
 *  - district lives on the related Farm document (location.district),
 *    reached via DiseaseReport.farmId — so this job joins through farmId.
 *  - diseaseName lives nested under `analysis.diseaseName`, and
 *    `analysis` is null until the AI pipeline finishes (status must be
 *    "completed"); reports without a finished analysis are skipped.
 *  - cropName *is* a direct field on DiseaseReport, so that part of the
 *    original assumption was correct.
 * Farm (Phase 3) tracks the crop as `currentCrop`, not `cropName`, and
 * district under `location.district`, not a top-level field.
 */

const DISEASE_REPORT_MODEL_NAME = "DiseaseReport";
const FARM_MODEL_NAME = "Farm";

const CLUSTER_THRESHOLD = 3;
const LOOKBACK_DAYS = 7;
const CLUSTER_RADIUS_LABEL_KM = 10; // descriptive only; real geo-radius logic is a future enhancement

interface DiseaseReportShape {
  _id: Types.ObjectId;
  farmId: Types.ObjectId;
  cropName: string;
  status: string;
  analysis: { diseaseName: string } | null;
  createdAt: Date;
}

interface FarmShape {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currentCrop: string;
  location: { district: string };
}

const getDiseaseReportModel = (): Model<DiseaseReportShape> => {
  if (!models[DISEASE_REPORT_MODEL_NAME]) {
    throw new Error(
      `Model "${DISEASE_REPORT_MODEL_NAME}" not registered. Ensure Phase 6 ` +
        `(Disease Detection) models are imported before jobs start, or ` +
        `update DISEASE_REPORT_MODEL_NAME in disease-risk.job.ts.`
    );
  }
  return models[DISEASE_REPORT_MODEL_NAME] as Model<DiseaseReportShape>;
};

const getFarmModel = (): Model<FarmShape> => {
  if (!models[FARM_MODEL_NAME]) {
    throw new Error(
      `Model "${FARM_MODEL_NAME}" not registered. Ensure Phase 3 (Farm ` +
        `Management) models are imported before jobs start, or update ` +
        `FARM_MODEL_NAME in disease-risk.job.ts.`
    );
  }
  return models[FARM_MODEL_NAME] as Model<FarmShape>;
};

interface Cluster {
  district: string;
  cropName: string;
  diseaseName: string;
  reportCount: number;
}

export const runDiseaseRiskAnalysis = async (): Promise<{
  reportsAnalyzed: number;
  clustersFound: number;
  alertsGenerated: number;
}> => {
  const DiseaseReport = getDiseaseReportModel();
  const Farm = getFarmModel();

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  // Only reports whose AI analysis has actually finished have a diseaseName.
  const reports = await DiseaseReport.find({
    createdAt: { $gte: since },
    status: "completed",
    analysis: { $ne: null },
  })
    .lean<DiseaseReportShape[]>()
    .exec();

  // district lives on Farm, not DiseaseReport — join through farmId.
  const farmIds = [...new Set(reports.map((r) => r.farmId.toString()))];
  const farmsById = new Map<string, FarmShape>();
  if (farmIds.length > 0) {
    const farmDocs = await Farm.find({ _id: { $in: farmIds } })
      .select("userId currentCrop location.district")
      .lean<FarmShape[]>()
      .exec();
    for (const farm of farmDocs) {
      farmsById.set(farm._id.toString(), farm);
    }
  }

  // Group by (district, cropName, diseaseName)
  const groups = new Map<string, DiseaseReportShape[]>();
  for (const report of reports) {
    const farm = farmsById.get(report.farmId.toString());
    const district = farm?.location?.district;
    const diseaseName = report.analysis?.diseaseName;

    if (!district || !diseaseName) continue; // can't place this report geographically

    const key = `${district}::${report.cropName}::${diseaseName}`;
    const bucket = groups.get(key) ?? [];
    bucket.push(report);
    groups.set(key, bucket);
  }

  const clusters: Cluster[] = [];
  for (const [key, bucket] of groups.entries()) {
    if (bucket.length < CLUSTER_THRESHOLD) continue;
    const [district, cropName, diseaseName] = key.split("::");
    clusters.push({
      district,
      cropName,
      diseaseName,
      reportCount: bucket.length,
    });
  }

  let alertsGenerated = 0;

  for (const cluster of clusters) {
    // Notify every farmer in the affected district currently growing
    // the affected crop. currentCrop casing isn't guaranteed to match
    // cropName casing (e.g. "cotton" vs "Cotton"), so compare
    // case-insensitively.
    const farms = await Farm.find({
      "location.district": cluster.district,
      currentCrop: new RegExp(`^${escapeRegex(cluster.cropName)}$`, "i"),
    })
      .select("userId")
      .lean<FarmShape[]>()
      .exec();

    const uniqueUserIds = [...new Set(farms.map((f) => f.userId.toString()))];

    if (uniqueUserIds.length === 0) continue;

    const riskLevel =
      cluster.reportCount >= CLUSTER_THRESHOLD * 2 ? "high" : "elevated";

    const inputs = uniqueUserIds.map((userId) => ({
      userId,
      title: `Disease risk warning: ${cluster.diseaseName} in ${cluster.district}`,
      message: `${cluster.reportCount} cases of ${cluster.diseaseName} reported on ${cluster.cropName} crops near ${cluster.district} in the last ${LOOKBACK_DAYS} days. Inspect your crop and consider preventive measures.`,
      type: NotificationType.DISEASE_ALERT,
      priority:
        riskLevel === "high"
          ? NotificationPriority.HIGH
          : NotificationPriority.MEDIUM,
      channel: NotificationChannel.IN_APP,
      metadata: {
        diseaseName: cluster.diseaseName,
        cropName: cluster.cropName,
        district: cluster.district,
        affectedRadius: CLUSTER_RADIUS_LABEL_KM,
        riskLevel,
      },
    }));

    const created = await notificationService.createNotificationsBulk(
      inputs
    );
    alertsGenerated += created.length;
  }

  return {
    reportsAnalyzed: reports.length,
    clustersFound: clusters.length,
    alertsGenerated,
  };
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const diseaseRiskWorker = new Worker(
  QUEUE_NAMES.DISEASE,
  async (_job: Job) => {
    const result = await runDiseaseRiskAnalysis();
    console.log(
      `[disease-risk] Analyzed ${result.reportsAnalyzed} reports, found ${result.clustersFound} clusters, generated ${result.alertsGenerated} alerts`
    );
    return result;
  },
  { connection: createRedisConnection(), concurrency: 1 }
);

diseaseRiskWorker.on("failed", (job, err) => {
  console.error(`[disease-risk] Job ${job?.id} failed:`, err.message);
});

export const scheduleDiseaseRisk = async (): Promise<void> => {
  await diseaseQueue.add(
    "disease-risk",
    {},
    {
      repeat: { pattern: JOB_SCHEDULES.DISEASE_RISK },
      jobId: "disease-risk-repeatable",
    }
  );
};