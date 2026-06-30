import { Worker, Job } from "bullmq";
import { Types, models, Model } from "mongoose";
import { createRedisConnection } from "../config/redis";
import { QUEUE_NAMES, marketQueue, JOB_SCHEDULES } from "./queue";
import { notificationService } from "../modules/notifications/services/notification.service";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "../modules/notifications/types/notification.types";
import { emitMarketPriceUpdate } from "../sockets/integrations/phase9-integration";

/**
 * market-sync.job.ts — runs every 6 hours (see JOB_SCHEDULES.MARKET_SYNC).
 *
 * Responsibilities (per spec):
 *  - Sync latest market prices
 *  - Detect major price changes
 *  - Generate alerts
 *
 * This module expects Phase 7 (Market Intelligence) and Phase 3 (Farm
 * Management) models to already exist in the project under the names
 * "MarketPrice" and "Farm". Rather than redefining those schemas here
 * (which would risk drifting from the real Phase 7 model), this job
 * accesses them via `mongoose.models`, falling back to lightweight
 * shape-only interfaces for typing. If your actual model names differ,
 * update MARKET_PRICE_MODEL_NAME / FARM_MODEL_NAME below.
 *
 * IMPORTANT — schema note:
 * The real MarketPrice schema (Phase 7) stores one row per
 * commodity+market+arrivalDate snapshot — there is no "previousPrice"
 * field on the document itself. "Previous price" is derived here by
 * comparing the latest snapshot for a commodity+market pair against the
 * next-most-recent snapshot for that same pair. Similarly, Farm (Phase 3)
 * tracks the crop a farm is currently growing under `currentCrop`, not
 * `cropName`.
 */

const MARKET_PRICE_MODEL_NAME = "MarketPrice";
const FARM_MODEL_NAME = "Farm";

const SIGNIFICANT_CHANGE_THRESHOLD_PERCENT = 10;

interface MarketPriceShape {
  _id: Types.ObjectId;
  commodity: string;
  market: string;
  district: string;
  state: string;
  modalPrice: number;
  arrivalDate: Date;
}

interface FarmShape {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currentCrop: string;
}

const getMarketPriceModel = (): Model<MarketPriceShape> => {
  if (!models[MARKET_PRICE_MODEL_NAME]) {
    throw new Error(
      `Model "${MARKET_PRICE_MODEL_NAME}" not registered. Ensure Phase 7 ` +
        `(Market Intelligence) models are imported before jobs start, or ` +
        `update MARKET_PRICE_MODEL_NAME in market-sync.job.ts to match ` +
        `your actual model name.`
    );
  }
  return models[MARKET_PRICE_MODEL_NAME] as Model<MarketPriceShape>;
};

const getFarmModel = (): Model<FarmShape> => {
  if (!models[FARM_MODEL_NAME]) {
    throw new Error(
      `Model "${FARM_MODEL_NAME}" not registered. Ensure Phase 3 (Farm ` +
        `Management) models are imported before jobs start, or update ` +
        `FARM_MODEL_NAME in market-sync.job.ts to match your actual model name.`
    );
  }
  return models[FARM_MODEL_NAME] as Model<FarmShape>;
};

const percentChange = (oldVal: number, newVal: number): number => {
  if (oldVal === 0) return 0;
  return ((newVal - oldVal) / oldVal) * 100;
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Groups the most recent two snapshots per commodity+market pair so we
 * can compare "latest" against "previous" without a previousPrice field
 * on the document itself.
 */
interface LatestPair {
  commodity: string;
  market: string;
  district: string;
  state: string;
  currentPrice: number;
  previousPrice: number;
}

const buildLatestPairs = (prices: MarketPriceShape[]): LatestPair[] => {
  const byKey = new Map<string, MarketPriceShape[]>();

  for (const price of prices) {
    const key = `${price.commodity}::${price.market}`;
    const existing = byKey.get(key) ?? [];
    existing.push(price);
    byKey.set(key, existing);
  }

  const pairs: LatestPair[] = [];

  for (const records of byKey.values()) {
    if (records.length < 2) continue; // nothing to compare against yet

    records.sort(
      (a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime()
    );

    const [latest, previous] = records;

    pairs.push({
      commodity: latest.commodity,
      market: latest.market,
      district: latest.district,
      state: latest.state,
      currentPrice: latest.modalPrice,
      previousPrice: previous.modalPrice,
    });
  }

  return pairs;
};

/**
 * Core sync logic, exported separately so it can be unit-tested or
 * invoked manually (e.g. from an admin "trigger job" endpoint) without
 * going through BullMQ.
 */
export const runMarketSync = async (): Promise<{
  pricesScanned: number;
  alertsGenerated: number;
}> => {
  const MarketPrice = getMarketPriceModel();
  const Farm = getFarmModel();

  const prices = await MarketPrice.find({}).lean<MarketPriceShape[]>().exec();
  const pairs = buildLatestPairs(prices);

  let alertsGenerated = 0;

  for (const pair of pairs) {
    const change = percentChange(pair.previousPrice, pair.currentPrice);

    // Live price tick — sent for every commodity+market pair regardless
    // of whether it crosses the alert threshold below. Subscribers in
    // commodity:{name} rooms get this on every sync run.
    emitMarketPriceUpdate({
      commodity: pair.commodity,
      state: pair.state,
      market: pair.market,
      pricePerQuintal: pair.currentPrice,
      previousPrice: pair.previousPrice,
    });

    if (Math.abs(change) < SIGNIFICANT_CHANGE_THRESHOLD_PERCENT) continue;

    // Notify every farmer currently growing this crop. currentCrop and
    // commodity casing aren't guaranteed to match (e.g. "wheat" vs
    // "Wheat"), so compare case-insensitively.
    const farms = await Farm.find({
      currentCrop: new RegExp(`^${escapeRegex(pair.commodity)}$`, "i"),
    })
      .select("userId")
      .lean<FarmShape[]>()
      .exec();

    const uniqueUserIds = [...new Set(farms.map((f) => f.userId.toString()))];

    if (uniqueUserIds.length === 0) continue;

    const direction = change > 0 ? "risen" : "dropped";
    const priority =
      Math.abs(change) >= 25
        ? NotificationPriority.HIGH
        : NotificationPriority.MEDIUM;

    const inputs = uniqueUserIds.map((userId) => ({
      userId,
      title: `${pair.commodity} price ${direction} ${Math.abs(change).toFixed(1)}%`,
      message: `${pair.commodity} at ${pair.market} is now ₹${pair.currentPrice}/quintal, ${direction} from ₹${pair.previousPrice}/quintal.`,
      type: NotificationType.MARKET_ALERT,
      priority,
      channel: NotificationChannel.IN_APP,
      metadata: {
        cropName: pair.commodity,
        mandiName: pair.market,
        previousPrice: pair.previousPrice,
        currentPrice: pair.currentPrice,
        percentChange: change,
      },
    }));

    const created = await notificationService.createNotificationsBulk(
      inputs
    );
    alertsGenerated += created.length;
  }

  return { pricesScanned: prices.length, alertsGenerated };
};

export const marketSyncWorker = new Worker(
  QUEUE_NAMES.MARKET,
  async (_job: Job) => {
    const result = await runMarketSync();
    console.log(
      `[market-sync] Scanned ${result.pricesScanned} prices, generated ${result.alertsGenerated} alerts`
    );
    return result;
  },
  { connection: createRedisConnection(), concurrency: 1 }
);

marketSyncWorker.on("failed", (job, err) => {
  console.error(`[market-sync] Job ${job?.id} failed:`, err.message);
});

/**
 * Registers the repeating schedule. Call once at app boot.
 */
export const scheduleMarketSync = async (): Promise<void> => {
  await marketQueue.add(
    "market-sync",
    {},
    {
      repeat: { pattern: JOB_SCHEDULES.MARKET_SYNC },
      jobId: "market-sync-repeatable",
    }
  );
};