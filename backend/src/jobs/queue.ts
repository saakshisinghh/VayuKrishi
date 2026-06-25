import { Queue, QueueOptions } from "bullmq";
import { createRedisConnection } from "../config/redis";

/**
 * Central place where every BullMQ Queue used by the backend is
 * instantiated. Workers (in each *.job.ts file) attach to these by name.
 *
 * One Redis connection per Queue, per BullMQ's own recommendation —
 * connections are cheap, contention on a single connection isn't worth it.
 */

const defaultQueueOptions: Omit<QueueOptions, "connection"> = {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 1000 },
  },
};

export const QUEUE_NAMES = {
  NOTIFICATION: "notification-queue",
  MARKET: "market-queue",
  WEATHER: "weather-queue",
  DISEASE: "disease-queue",
  SCHEME: "scheme-queue",
} as const;

export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, {
  connection: createRedisConnection(),
  ...defaultQueueOptions,
});

export const marketQueue = new Queue(QUEUE_NAMES.MARKET, {
  connection: createRedisConnection(),
  ...defaultQueueOptions,
});

export const weatherQueue = new Queue(QUEUE_NAMES.WEATHER, {
  connection: createRedisConnection(),
  ...defaultQueueOptions,
});

export const diseaseQueue = new Queue(QUEUE_NAMES.DISEASE, {
  connection: createRedisConnection(),
  ...defaultQueueOptions,
});

export const schemeQueue = new Queue(QUEUE_NAMES.SCHEME, {
  connection: createRedisConnection(),
  ...defaultQueueOptions,
});

/**
 * Repeatable-job schedules, expressed as cron expressions, matching the
 * spec's stated cadence for each sync job. Registered once at boot via
 * registerRepeatableJobs() in src/jobs/index.ts (or your app bootstrap).
 */
export const JOB_SCHEDULES = {
  MARKET_SYNC: "0 */6 * * *", // every 6 hours
  WEATHER_SYNC: "0 */3 * * *", // every 3 hours
  DISEASE_RISK: "0 2 * * *", // daily at 02:00
  SCHEME_SYNC: "0 3 * * *", // daily at 03:00
} as const;

/**
 * Graceful shutdown helper — call from your process SIGTERM/SIGINT handler.
 */
export const closeAllQueues = async (): Promise<void> => {
  await Promise.all([
    notificationQueue.close(),
    marketQueue.close(),
    weatherQueue.close(),
    diseaseQueue.close(),
    schemeQueue.close(),
  ]);
};
