import { Worker, Job } from "bullmq";
import { Types, models, Model } from "mongoose";
import { createRedisConnection } from "../config/redis";
import { QUEUE_NAMES, schemeQueue, JOB_SCHEDULES } from "./queue";
import { notificationService } from "../modules/notifications/services/notification.service";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "../modules/notifications/types/notification.types";

/**
 * scheme-sync.job.ts — runs daily (see JOB_SCHEDULES.SCHEME_SYNC).
 *
 * Responsibilities (per spec):
 *  - Sync government schemes
 *  - Notify eligible farmers
 *
 * Expects Phase 8 (Government Schemes) to provide a "Scheme" model with
 * eligibility criteria, and Phase 3 to provide "Farm" (used as a proxy
 * for farmer profile: state, crop, land size).
 *
 * IMPORTANT — schema note:
 * The real Scheme schema (Phase 8) does not have an `isNewOrUpdated`
 * flag, so "new or updated" is approximated here as "updated within the
 * lookback window" (LOOKBACK_DAYS), via Mongo's updatedAt timestamp.
 * Field names also differ from the original assumption:
 *  - scheme.name -> scheme.schemeName
 *  - scheme.cropTypes -> scheme.eligibilityCriteria.cropTypes
 *  - scheme.maxLandSizeAcres -> scheme.eligibilityCriteria.maxFarmSize,
 *    which is stored in HECTARES, not acres — Farm areas are converted
 *    to hectares before comparing.
 *  - scheme.deadline -> scheme.endDate
 * Farm (Phase 3) tracks crop as `currentCrop` (not `cropName`), state
 * under `location.state` (not a top-level field), and area as
 * `totalArea` + `areaUnit` ('acre' | 'hectare').
 *
 * Eligibility criteria that have no equivalent on Farm (minAge,
 * genderRestriction, incomeLimitAnnual, farmerCategories, waterSources)
 * are intentionally NOT checked here — Farm has no farmer-profile data
 * to evaluate them against. Matching is limited to state, crop type,
 * and land size, which Farm can actually answer.
 */

const SCHEME_MODEL_NAME = "Scheme";
const FARM_MODEL_NAME = "Farm";

const LOOKBACK_DAYS = 1; // schemes updated within the last sync cycle
const ACRES_PER_HECTARE = 2.47105;

interface SchemeShape {
  _id: Types.ObjectId;
  schemeName: string;
  state: string; // "All" or specific state
  eligibilityCriteria: {
    states: string[];
    minFarmSize: number | null; // hectares
    maxFarmSize: number | null; // hectares
    cropTypes: string[];
  };
  endDate: Date | null;
  isActive: boolean;
  updatedAt: Date;
}

interface FarmShape {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  location: { state: string };
  currentCrop: string;
  totalArea: number;
  areaUnit: "acre" | "hectare";
}

const getSchemeModel = (): Model<SchemeShape> => {
  if (!models[SCHEME_MODEL_NAME]) {
    throw new Error(
      `Model "${SCHEME_MODEL_NAME}" not registered. Ensure Phase 8 ` +
        `(Government Schemes) models are imported before jobs start, or ` +
        `update SCHEME_MODEL_NAME in scheme-sync.job.ts.`
    );
  }
  return models[SCHEME_MODEL_NAME] as Model<SchemeShape>;
};

const getFarmModel = (): Model<FarmShape> => {
  if (!models[FARM_MODEL_NAME]) {
    throw new Error(
      `Model "${FARM_MODEL_NAME}" not registered. Ensure Phase 3 (Farm ` +
        `Management) models are imported before jobs start, or update ` +
        `FARM_MODEL_NAME in scheme-sync.job.ts.`
    );
  }
  return models[FARM_MODEL_NAME] as Model<FarmShape>;
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toHectares = (farm: FarmShape): number =>
  farm.areaUnit === "acre" ? farm.totalArea / ACRES_PER_HECTARE : farm.totalArea;

const matchesEligibility = (scheme: SchemeShape, farm: FarmShape): boolean => {
  const { eligibilityCriteria: criteria } = scheme;

  const allowedStates =
    criteria.states && criteria.states.length > 0
      ? criteria.states
      : scheme.state && scheme.state !== "All"
      ? [scheme.state]
      : [];

  if (allowedStates.length > 0) {
    const farmState = farm.location?.state;
    const matchesState = allowedStates.some(
      (s) => s.toLowerCase() === (farmState ?? "").toLowerCase()
    );
    if (!matchesState) return false;
  }

  if (criteria.cropTypes && criteria.cropTypes.length > 0) {
    const matchesCrop = criteria.cropTypes.some(
      (c) => c.toLowerCase() === (farm.currentCrop ?? "").toLowerCase()
    );
    if (!matchesCrop) return false;
  }

  const farmSizeHectares = toHectares(farm);

  if (
    typeof criteria.maxFarmSize === "number" &&
    farmSizeHectares > criteria.maxFarmSize
  ) {
    return false;
  }

  if (
    typeof criteria.minFarmSize === "number" &&
    farmSizeHectares < criteria.minFarmSize
  ) {
    return false;
  }

  return true;
};

export const runSchemeSync = async (): Promise<{
  schemesChecked: number;
  alertsGenerated: number;
}> => {
  const Scheme = getSchemeModel();
  const Farm = getFarmModel();

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  const recentSchemes = await Scheme.find({
    isActive: true,
    updatedAt: { $gte: since },
  })
    .lean<SchemeShape[]>()
    .exec();

  let alertsGenerated = 0;

  for (const scheme of recentSchemes) {
    const { eligibilityCriteria: criteria } = scheme;

    const farmQuery: Record<string, unknown> = {};

    const allowedStates =
      criteria.states && criteria.states.length > 0
        ? criteria.states
        : scheme.state && scheme.state !== "All"
        ? [scheme.state]
        : [];

    if (allowedStates.length > 0) {
      farmQuery["location.state"] = {
        $in: allowedStates.map((s) => new RegExp(`^${escapeRegex(s)}$`, "i")),
      };
    }

    if (criteria.cropTypes && criteria.cropTypes.length > 0) {
      farmQuery.currentCrop = {
        $in: criteria.cropTypes.map(
          (c) => new RegExp(`^${escapeRegex(c)}$`, "i")
        ),
      };
    }

    const candidateFarms = await Farm.find(farmQuery)
      .lean<FarmShape[]>()
      .exec();

    const eligibleFarms = candidateFarms.filter((farm) =>
      matchesEligibility(scheme, farm)
    );

    const uniqueUserIds = [
      ...new Set(eligibleFarms.map((f) => f.userId.toString())),
    ];

    if (uniqueUserIds.length > 0) {
      const inputs = uniqueUserIds.map((userId) => ({
        userId,
        title: `New scheme available: ${scheme.schemeName}`,
        message: scheme.endDate
          ? `You may be eligible for "${scheme.schemeName}". Apply before ${new Date(
              scheme.endDate
            ).toLocaleDateString("en-IN")}.`
          : `You may be eligible for "${scheme.schemeName}". Check the scheme page for details.`,
        type: NotificationType.SCHEME_ALERT,
        priority: NotificationPriority.MEDIUM,
        channel: NotificationChannel.IN_APP,
        metadata: {
          schemeId: scheme._id.toString(),
          schemeName: scheme.schemeName,
          deadline: scheme.endDate?.toISOString(),
        },
      }));

      const created = await notificationService.createNotificationsBulk(
        inputs
      );
      alertsGenerated += created.length;
    }
  }

  return {
    schemesChecked: recentSchemes.length,
    alertsGenerated,
  };
};

export const schemeSyncWorker = new Worker(
  QUEUE_NAMES.SCHEME,
  async (_job: Job) => {
    const result = await runSchemeSync();
    console.log(
      `[scheme-sync] Checked ${result.schemesChecked} schemes, generated ${result.alertsGenerated} alerts`
    );
    return result;
  },
  { connection: createRedisConnection(), concurrency: 1 }
);

schemeSyncWorker.on("failed", (job, err) => {
  console.error(`[scheme-sync] Job ${job?.id} failed:`, err.message);
});

export const scheduleSchemeSync = async (): Promise<void> => {
  await schemeQueue.add(
    "scheme-sync",
    {},
    {
      repeat: { pattern: JOB_SCHEDULES.SCHEME_SYNC },
      jobId: "scheme-sync-repeatable",
    }
  );
};