import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { requireRole } from "../../../middlewares/auth";
import { validate } from "../../../common/middlewares/validate";
import {
  listNotificationsQuerySchema,
  unreadQuerySchema,
  notificationIdParamSchema,
  updatePreferencesSchema,
  testNotificationSchema,
} from "../validators/notification.validator";

const router = Router();

// All notification routes require authentication.
router.use(authenticate);

/**
 * IMPORTANT: /unread and /preferences must be registered before /:id
 * so Express doesn't try to match them as a notification id.
 */

// GET /api/v1/notifications/unread
router.get(
  "/unread",
  validate(unreadQuerySchema, "query"),
  notificationController.getUnreadNotifications
);

// GET /api/v1/notifications/preferences
router.get("/preferences", notificationController.getPreferences);

// PATCH /api/v1/notifications/preferences
router.patch(
  "/preferences",
  validate(updatePreferencesSchema, "body"),
  notificationController.updatePreferences
);

// PATCH /api/v1/notifications/read-all
router.patch("/read-all", notificationController.markAllAsRead);

// POST /api/v1/notifications/test  (admin only)
router.post(
  "/test",
  requireRole("admin"),
  validate(testNotificationSchema, "body"),
  notificationController.createTestNotification
);

// GET /api/v1/notifications
router.get(
  "/",
  validate(listNotificationsQuerySchema, "query"),
  notificationController.getNotifications
);

// GET /api/v1/notifications/:id
router.get(
  "/:id",
  validate(notificationIdParamSchema, "params"),
  notificationController.getNotificationById
);

// PATCH /api/v1/notifications/:id/read
router.patch(
  "/:id/read",
  validate(notificationIdParamSchema, "params"),
  notificationController.markAsRead
);

export default router;
