import { z } from "zod";
import { Types } from "mongoose";
import {
  NotificationType,
  NotificationStatus,
  NotificationChannel,
} from "../types/notification.types";

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid identifier format",
});

/**
 * GET /notifications query params: pagination + optional filters.
 * Coerces query-string values ("2") into the right primitive types.
 */
export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.nativeEnum(NotificationType).optional(),
  status: z.nativeEnum(NotificationStatus).optional(),
});

export type ListNotificationsQuery = z.infer<
  typeof listNotificationsQuerySchema
>;

/**
 * GET /notifications/unread query params: pagination only.
 */
export const unreadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UnreadQuery = z.infer<typeof unreadQuerySchema>;

/**
 * Params for routes with :id
 */
export const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});

export type NotificationIdParam = z.infer<typeof notificationIdParamSchema>;

/**
 * PATCH /notifications/preferences body.
 * All fields optional — partial update semantics.
 */
export const updatePreferencesSchema = z
  .object({
    marketAlerts: z.boolean().optional(),
    weatherAlerts: z.boolean().optional(),
    diseaseAlerts: z.boolean().optional(),
    schemeAlerts: z.boolean().optional(),
    farmReminders: z.boolean().optional(),
    emailEnabled: z.boolean().optional(),
    smsEnabled: z.boolean().optional(),
    whatsappEnabled: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one preference field must be provided",
  });

export type UpdatePreferencesBody = z.infer<typeof updatePreferencesSchema>;

/**
 * POST /notifications/test body (admin only).
 */
export const testNotificationSchema = z.object({
  userId: objectIdSchema,
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM),
  channel: z
    .nativeEnum(NotificationChannel)
    .default(NotificationChannel.IN_APP),
});

export type TestNotificationBody = z.infer<typeof testNotificationSchema>;
