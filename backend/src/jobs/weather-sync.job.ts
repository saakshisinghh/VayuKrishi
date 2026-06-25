import { Worker, Job } from "bullmq";
import { Types, models, Model } from "mongoose";
import { createRedisConnection } from "../config/redis";
import { QUEUE_NAMES, weatherQueue, JOB_SCHEDULES } from "./queue";
import { notificationService } from "../modules/notifications/services/notification.service";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "../modules/notifications/types/notification.types";

/**
 * weather-sync.job.ts — runs every 3 hours (see JOB_SCHEDULES.WEATHER_SYNC).
 *
 * Responsibilities (per spec):
 *  - Fetch weather updates
 *  - Identify severe conditions
 *  - Generate alerts
 *
 * Like market-sync, this expects a "Farm" model (Phase 3) to resolve
 * district -> affected farmers. The actual weather data source is left
 * as a pluggable fetcher (`fetchWeatherUpdates`) — swap its internals
 * for a real provider (IMD, OpenWeather, etc.) without touching the
 * alerting logic below.
 */

const FARM_MODEL_NAME = "Farm";

const SEVERE_CONDITIONS = [
  "heavy_rain",
  "thunderstorm",
  "hailstorm",
  "heatwave",
  "frost",
  "cyclone",
  "drought_warning",
] as const;

type SevereCondition = (typeof SEVERE_CONDITIONS)[number];

interface WeatherUpdate {
  district: string;
  condition: SevereCondition | string;
  severity: "moderate" | "severe" | "extreme";
  description: string;
}

interface FarmShape {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  district: string;
}

const getFarmModel = (): Model<FarmShape> => {
  if (!models[FARM_MODEL_NAME]) {
    throw new Error(
      `Model "${FARM_MODEL_NAME}" not registered. Ensure Phase 3 (Farm ` +
        `Management) models are imported before jobs start, or update ` +
        `FARM_MODEL_NAME in weather-sync.job.ts to match your actual model name.`
    );
  }
  return models[FARM_MODEL_NAME] as Model<FarmShape>;
};

/**
 * Pluggable weather data fetcher. Replace this implementation with a
 * real call to your weather provider (IMD API, OpenWeatherMap, etc.)
 * — the return shape is the only contract the rest of this job relies on.
 */
const fetchWeatherUpdates = async (): Promise<WeatherUpdate[]> => {
  // STUB: no live weather provider wired yet. Returns an empty list so
  // the job runs safely in CI/dev without external dependencies.
  console.log(
    "[weather-sync] fetchWeatherUpdates() is a stub — wire a real provider here."
  );
  return [];
};

const isSevere = (severity: WeatherUpdate["severity"]): boolean =>
  severity === "severe" || severity === "extreme";

export const runWeatherSync = async (): Promise<{
  updatesFetched: number;
  alertsGenerated: number;
}> => {
  const Farm = getFarmModel();
  const updates = await fetchWeatherUpdates();

  let alertsGenerated = 0;

  for (const update of updates) {
    if (!isSevere(update.severity)) continue;

    const farms = await Farm.find({ district: update.district })
      .select("userId")
      .lean<FarmShape[]>()
      .exec();

    const uniqueUserIds = [...new Set(farms.map((f) => f.userId.toString()))];

    if (uniqueUserIds.length === 0) continue;

    const priority =
      update.severity === "extreme"
        ? NotificationPriority.CRITICAL
        : NotificationPriority.HIGH;

    const inputs = uniqueUserIds.map((userId) => ({
      userId,
      title: `Weather alert: ${update.condition.replace(/_/g, " ")} in ${update.district}`,
      message: update.description,
      type: NotificationType.WEATHER_ALERT,
      priority,
      channel: NotificationChannel.IN_APP,
      metadata: {
        district: update.district,
        condition: update.condition,
        severity: update.severity,
      },
    }));

    const created = await notificationService.createNotificationsBulk(
      inputs
    );
    alertsGenerated += created.length;
  }

  return { updatesFetched: updates.length, alertsGenerated };
};

export const weatherSyncWorker = new Worker(
  QUEUE_NAMES.WEATHER,
  async (_job: Job) => {
    const result = await runWeatherSync();
    console.log(
      `[weather-sync] Fetched ${result.updatesFetched} updates, generated ${result.alertsGenerated} alerts`
    );
    return result;
  },
  { connection: createRedisConnection(), concurrency: 1 }
);

weatherSyncWorker.on("failed", (job, err) => {
  console.error(`[weather-sync] Job ${job?.id} failed:`, err.message);
});

export const scheduleWeatherSync = async (): Promise<void> => {
  await weatherQueue.add(
    "weather-sync",
    {},
    {
      repeat: { pattern: JOB_SCHEDULES.WEATHER_SYNC },
      jobId: "weather-sync-repeatable",
    }
  );
};
