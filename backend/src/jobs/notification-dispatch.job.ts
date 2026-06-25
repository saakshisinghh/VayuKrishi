import { Worker, Job } from "bullmq";
import {
  createRedisConnection,
  cacheClient,
  RETRY_TRACKING_PREFIX,
} from "../config/redis";
import { QUEUE_NAMES } from "./queue";
import { notificationService } from "../modules/notifications/services/notification.service";
import { notificationRepository } from "../modules/notifications/repositories/notification.repository";

/**
 * notification-dispatch.job.ts
 *
 * "Runs continuously" per spec — implemented as a long-lived BullMQ
 * Worker (not a cron job) that processes the `notification-queue` as
 * jobs are enqueued by NotificationService.createNotification(). This
 * is the standard BullMQ pattern for continuous/event-driven work, as
 * opposed to the scheduled sync jobs which use cron-style repeatables.
 *
 * Responsibilities (per spec):
 *  - Process pending notifications
 *  - Mark delivery status
 *  - Retry failures
 */

interface DispatchJobData {
  notificationId: string;
}

const CONCURRENCY = 10;
const MAX_RETRY_TRACKING = 3;

export const notificationDispatchWorker = new Worker<DispatchJobData>(
  QUEUE_NAMES.NOTIFICATION,
  async (job: Job<DispatchJobData>) => {
    const { notificationId } = job.data;

    try {
      await notificationService.sendNotification(notificationId);
    } catch (err) {
      // Track retry attempts in Redis independently of BullMQ's own
      // attempt counter, so we have visibility for analytics even if
      // the job eventually exhausts BullMQ's `attempts` and dead-letters.
      const retryKey = `${RETRY_TRACKING_PREFIX}${notificationId}`;
      const attempts = await cacheClient.incr(retryKey);
      await cacheClient.expire(retryKey, 86400); // 24h TTL on tracking key

      console.error(
        `[notification-dispatch] Failed notificationId=${notificationId} attempt=${attempts}`,
        err instanceof Error ? err.message : err
      );

      throw err; // rethrow so BullMQ applies its own backoff/retry policy
    }
  },
  {
    connection: createRedisConnection(),
    concurrency: CONCURRENCY,
  }
);

notificationDispatchWorker.on("completed", (job) => {
  console.log(`[notification-dispatch] Delivered job=${job.id}`);
});

notificationDispatchWorker.on("failed", (job, err) => {
  console.error(
    `[notification-dispatch] Job ${job?.id} failed permanently:`,
    err.message
  );
});

/**
 * Sweep function for any PENDING notifications that somehow never got
 * a corresponding queue job (e.g. created directly via a script, or a
 * queue job was lost during a Redis restart). Safe to run on an
 * interval as a reconciliation pass — not the primary delivery path.
 */
export const sweepPendingNotifications = async (
  batchSize = 100
): Promise<number> => {
  const pending = await notificationRepository.findPending(batchSize);

  for (const notification of pending) {
    try {
      await notificationService.sendNotification(notification._id.toString());
    } catch {
      // individual failures are logged inside sendNotification; continue sweep
    }
  }

  return pending.length;
};
