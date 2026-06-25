import { Types } from "mongoose";

/**
 * Notification category. Drives which preference flag gates delivery
 * and which icon/template the client renders.
 */
export enum NotificationType {
  MARKET_ALERT = "market_alert",
  WEATHER_ALERT = "weather_alert",
  DISEASE_ALERT = "disease_alert",
  SCHEME_ALERT = "scheme_alert",
  FARM_REMINDER = "farm_reminder",
  SYSTEM = "system",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Delivery channel. Only `in_app` is actually wired to a live provider
 * today; the rest are modeled now so the dispatch job and schema don't
 * need to change shape when real providers (Phase 10+) are plugged in.
 */
export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
  WHATSAPP = "whatsapp",
  PUSH = "push",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

/**
 * Free-form, type-specific payload. Using a discriminated-ish bag rather
 * than strict per-type interfaces keeps the Mongo schema flexible while
 * still giving callers IntelliSense for the common cases.
 */
export interface NotificationMetadata {
  // market_alert
  cropName?: string;
  mandiName?: string;
  previousPrice?: number;
  currentPrice?: number;
  percentChange?: number;

  // weather_alert
  district?: string;
  condition?: string;
  severity?: string;

  // disease_alert
  diseaseName?: string;
  affectedRadius?: number;
  riskLevel?: string;

  // scheme_alert
  schemeId?: string;
  schemeName?: string;
  deadline?: string;

  // farm_reminder
  farmId?: string;
  reminderType?: string;

  // analytics / dispatch bookkeeping
  clickedAt?: string;
  deliveryAttempts?: number;
  lastError?: string;

  [key: string]: unknown;
}

export interface CreateNotificationInput {
  userId: Types.ObjectId | string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  metadata?: NotificationMetadata;
}

export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdatePreferencesInput {
  marketAlerts?: boolean;
  weatherAlerts?: boolean;
  diseaseAlerts?: boolean;
  schemeAlerts?: boolean;
  farmReminders?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  pushEnabled?: boolean;
}

/**
 * Maps a notification type to the preference field that gates it.
 * `system` notifications are never gated — they always go through.
 */
export const TYPE_TO_PREFERENCE_FIELD: Partial<
  Record<NotificationType, keyof UpdatePreferencesInput>
> = {
  [NotificationType.MARKET_ALERT]: "marketAlerts",
  [NotificationType.WEATHER_ALERT]: "weatherAlerts",
  [NotificationType.DISEASE_ALERT]: "diseaseAlerts",
  [NotificationType.SCHEME_ALERT]: "schemeAlerts",
  [NotificationType.FARM_REMINDER]: "farmReminders",
};
