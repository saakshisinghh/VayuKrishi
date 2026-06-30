import { Types } from "mongoose";
import { notificationRepository } from "../repositories/notification.repository";
import { preferenceRepository } from "../repositories/preference.repository";
import { getChannelProvider } from "./channelProviders";
import { notificationQueue } from "../../../jobs/queue";
import { cacheClient, UNREAD_COUNT_PREFIX } from "../../../config/redis";
import { ApiError } from "../../../shared/utils/api-error";
import { emitNotificationCreated } from "../../../sockets/integrations/phase9-integration";
import {
  CreateNotificationInput,
  NotificationFilters,
  PaginationParams,
  PaginatedResult,
  UpdatePreferencesInput,
  NotificationStatus,
  NotificationType,
  NotificationChannel,
  TYPE_TO_PREFERENCE_FIELD,
} from "../types/notification.types";
import { NotificationDocument } from "../notification.model";
import { PreferenceDocument } from "../preference.model";

const VALID_SOCKET_TYPES = [
  "info",
  "warning",
  "alert",
  "disease_alert",
  "market_update",
  "scheme_alert",
  "job_status",
] as const;

type SocketNotificationType = (typeof VALID_SOCKET_TYPES)[number];

// Real mapping from Phase 9's NotificationType enum to Phase 11's socket
// type strings — replaces the earlier "fallback to info" stopgap now that
// the actual enum values are known.
const NOTIFICATION_TYPE_TO_SOCKET_TYPE: Record<NotificationType, SocketNotificationType> = {
  [NotificationType.MARKET_ALERT]: "market_update",
  [NotificationType.DISEASE_ALERT]: "disease_alert",
  [NotificationType.SCHEME_ALERT]: "scheme_alert",
  [NotificationType.WEATHER_ALERT]: "warning",
  [NotificationType.FARM_REMINDER]: "info",
  [NotificationType.SYSTEM]: "info",
};

function toSocketNotificationType(
  type: NotificationType
): SocketNotificationType {
  return NOTIFICATION_TYPE_TO_SOCKET_TYPE[type] ?? "info";
}

export class NotificationService {
  /**
   * Creates a notification record AND enqueues it for dispatch.
   * Respects the user's category preference (e.g. marketAlerts: false
   * means we never even create a market_alert for them) — `system`
   * notifications bypass preference checks entirely since they're
   * typically account/security related.
   */
  async createNotification(
    input: CreateNotificationInput
  ): Promise<NotificationDocument | null> {
    const preferenceField = TYPE_TO_PREFERENCE_FIELD[input.type];

    if (preferenceField) {
      const prefs = await preferenceRepository.findOrCreate(
        input.userId.toString()
      );
      if (!prefs[preferenceField]) {
        // User opted out of this category entirely — skip silently.
        return null;
      }
    }

    const notification = await notificationRepository.create(input);

    await this.enqueueForDispatch(notification);
    await this.invalidateUnreadCache(input.userId.toString());

    return notification;
  }

  /**
   * Bulk variant for jobs that fan a single alert out to many users
   * (e.g. market-sync notifying every farmer who grows a given crop).
   * Filters out users who have the category disabled before insert.
   */
  async createNotificationsBulk(
    inputs: CreateNotificationInput[]
  ): Promise<NotificationDocument[]> {
    if (inputs.length === 0) return [];

    const eligible: CreateNotificationInput[] = [];

    for (const input of inputs) {
      const preferenceField = TYPE_TO_PREFERENCE_FIELD[input.type];
      if (!preferenceField) {
        eligible.push(input);
        continue;
      }
      const prefs = await preferenceRepository.findOrCreate(
        input.userId.toString()
      );
      if (prefs[preferenceField]) eligible.push(input);
    }

    if (eligible.length === 0) return [];

    const created = await notificationRepository.createMany(eligible);

    await Promise.all(
      created.map((n) => this.enqueueForDispatch(n))
    );
    await Promise.all(
      [...new Set(eligible.map((i) => i.userId.toString()))].map((uid) =>
        this.invalidateUnreadCache(uid)
      )
    );

    return created;
  }

  /**
   * Pushes a dispatch job onto the queue. The actual send happens in
   * notification-dispatch.job.ts's worker, decoupling "notification
   * created" (fast, synchronous) from "notification delivered" (can be
   * slow / can fail / should retry).
   */
  private async enqueueForDispatch(
    notification: NotificationDocument
  ): Promise<void> {
    await notificationQueue.add(
      "dispatch",
      { notificationId: notification._id.toString() },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 500,
        removeOnFail: 1000,
      }
    );
  }

  /**
   * Performs the actual send for a single notification via its assigned
   * channel provider. Called from the dispatch worker. Updates status
   * and records delivery attempts/errors into metadata for analytics.
   */
  async sendNotification(notificationId: string): Promise<void> {
    const notification = await notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    if (notification.status === NotificationStatus.DELIVERED) {
      return; // already delivered, nothing to do
    }

    const provider = getChannelProvider(notification.channel);
    const attempts = (notification.metadata?.deliveryAttempts ?? 0) + 1;

    let result;
    try {
      result = await provider.send(
        notification as unknown as NotificationDocument
      );
    } catch (err) {
      // Provider threw instead of returning { success: false } — normalize
      // it into the same failure path below.
      result = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }

    if (result.success) {
      await notificationRepository.update(notificationId, {
        status: NotificationStatus.DELIVERED,
        "metadata.deliveryAttempts": attempts,
      });

      await emitNotificationCreated(notification.userId.toString(), {
        _id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        type: toSocketNotificationType(notification.type),
        priority: notification.priority,
      });

      return;
    }

    const errorMessage = result.error ?? "Unknown delivery error";
    await notificationRepository.update(notificationId, {
      status: NotificationStatus.FAILED,
      "metadata.deliveryAttempts": attempts,
      "metadata.lastError": errorMessage,
    });
    throw new ApiError(502, errorMessage);
  }

  async getNotifications(
    userId: string,
    filters: NotificationFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<NotificationDocument>> {
    return notificationRepository.findMany(userId, filters, pagination);
  }

  async getUnreadNotifications(
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<NotificationDocument>> {
    return notificationRepository.findUnread(userId, pagination);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cacheKey = `${UNREAD_COUNT_PREFIX}${userId}`;
    try {
      const cached = await cacheClient.get(cacheKey);
      if (cached !== null) return parseInt(cached, 10);
    } catch {
      // cache miss/error is non-fatal, fall through to DB
    }

    const count = await notificationRepository.countUnread(userId);

    try {
      await cacheClient.set(cacheKey, count.toString(), "EX", 60);
    } catch {
      // best-effort cache write
    }

    return count;
  }

  async getNotificationById(
    id: string,
    userId: string
  ): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid notification id");
    }

    const notification = await notificationRepository.findByIdAndUser(
      id,
      userId
    );

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    return notification;
  }

  async markAsRead(
    id: string,
    userId: string
  ): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid notification id");
    }

    const updated = await notificationRepository.markAsRead(id, userId);

    if (!updated) {
      throw ApiError.notFound("Notification not found");
    }

    await this.invalidateUnreadCache(userId);

    return updated;
  }

  async markAllAsRead(
    userId: string
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const result = await notificationRepository.markAllAsRead(userId);
    await this.invalidateUnreadCache(userId);
    return result;
  }

  async getPreferences(userId: string): Promise<PreferenceDocument> {
    return preferenceRepository.findOrCreate(userId);
  }

  async updatePreferences(
    userId: string,
    input: UpdatePreferencesInput
  ): Promise<PreferenceDocument> {
    return preferenceRepository.update(userId, input);
  }

  /**
   * Admin-only test notification generator (POST /notifications/test).
   */
  async createTestNotification(
    userId: string,
    type: NotificationType = NotificationType.SYSTEM,
    channel: NotificationChannel = NotificationChannel.IN_APP
  ): Promise<NotificationDocument | null> {
    return this.createNotification({
      userId,
      title: "Test Notification",
      message:
        "This is a test notification generated by an admin to verify the notification pipeline end-to-end.",
      type,
      channel,
      metadata: { isTest: true },
    });
  }

  private async invalidateUnreadCache(userId: string): Promise<void> {
    try {
      await cacheClient.del(`${UNREAD_COUNT_PREFIX}${userId}`);
    } catch {
      // best-effort; a stale cached count for up to 60s is acceptable
    }
  }
}

export const notificationService = new NotificationService();