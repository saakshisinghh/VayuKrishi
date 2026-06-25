/**
 * src/jobs/index.ts
 *
 * Single entrypoint that:
 *   1. Imports every worker file (which, as a side effect of import,
 *      instantiates the BullMQ Worker and starts it listening).
 *   2. Registers the repeatable (cron) schedules for the sync jobs.
 *
 * Call `initializeJobs()` once from your app bootstrap (e.g. src/server.ts),
 * AFTER your Mongoose connection is established and AFTER all domain
 * models (Farm, MarketPrice, DiseaseReport, Scheme, etc. from Phases 3,
 * 6, 7, 8) have been imported/registered — the sync jobs resolve those
 * models lazily via `mongoose.models` and will throw a clear error if
 * they're not registered yet.
 */

import "./notification-dispatch.job";
import { marketSyncWorker, scheduleMarketSync } from "./market-sync.job";
import { weatherSyncWorker, scheduleWeatherSync } from "./weather-sync.job";
import { diseaseRiskWorker, scheduleDiseaseRisk } from "./disease-risk.job";
import { schemeSyncWorker, scheduleSchemeSync } from "./scheme-sync.job";
import { closeAllQueues } from "./queue";

export const initializeJobs = async (): Promise<void> => {
  console.log("[jobs] Starting workers...");

  // Workers are already running as a side effect of the imports above.
  // Here we just register their repeatable schedules.
  await Promise.all([
    scheduleMarketSync(),
    scheduleWeatherSync(),
    scheduleDiseaseRisk(),
    scheduleSchemeSync(),
  ]);

  console.log("[jobs] All workers started and schedules registered:");
  console.log("  - notification-dispatch: continuous (event-driven)");
  console.log("  - market-sync: every 6 hours");
  console.log("  - weather-sync: every 3 hours");
  console.log("  - disease-risk: daily at 02:00");
  console.log("  - scheme-sync: daily at 03:00");
};

export const shutdownJobs = async (): Promise<void> => {
  console.log("[jobs] Shutting down workers...");
  await Promise.all([
    marketSyncWorker.close(),
    weatherSyncWorker.close(),
    diseaseRiskWorker.close(),
    schemeSyncWorker.close(),
  ]);
  await closeAllQueues();
  console.log("[jobs] All workers and queues closed.");
};
