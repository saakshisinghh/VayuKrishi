import { Response } from "express";
import { notificationService } from "../services/notification.service";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ApiError } from "../../../shared/utils/api-error";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { AuthRequest } from "../../../common/middlewares/auth";
import {
  ListNotificationsQuery,
  UnreadQuery,
  NotificationIdParam,
  UpdatePreferencesBody,
  TestNotificationBody,
} from "../validators/notification.validator";

/**
 * Controller layer — translates HTTP <-> service calls. No business
 * logic lives here; it only reads the (already-validated) request,
 * calls the service, and shapes the response envelope.
 */
class NotificationController {
  getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit, type, status } =
      req.query as unknown as ListNotificationsQuery;

    const result = await notificationService.getNotifications(
      userId,
      { type, status },
      { page, limit }
    );

    return ApiResponse.success(res, {
      notifications: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  });

  getUnreadNotifications = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.userId;
      const { page, limit } = req.query as unknown as UnreadQuery;

      const [result, unreadCount] = await Promise.all([
        notificationService.getUnreadNotifications(userId, { page, limit }),
        notificationService.getUnreadCount(userId),
      ]);

      return ApiResponse.success(res, {
        notifications: result.items,
        unreadCount,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    }
  );

  getNotificationById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as NotificationIdParam;

      const notification = await notificationService.getNotificationById(
        id,
        userId
      );

      return ApiResponse.success(res, { notification });
    }
  );

  markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params as unknown as NotificationIdParam;

    const notification = await notificationService.markAsRead(id, userId);

    return ApiResponse.success(
      res,
      { notification },
      "Notification marked as read"
    );
  });

  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const result = await notificationService.markAllAsRead(userId);

    return ApiResponse.success(
      res,
      { modifiedCount: result.modifiedCount },
      "All notifications marked as read"
    );
  });

  getPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const preferences = await notificationService.getPreferences(userId);

    return ApiResponse.success(res, { preferences });
  });

  updatePreferences = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.userId;
      const body = req.body as UpdatePreferencesBody;

      const preferences = await notificationService.updatePreferences(
        userId,
        body
      );

      return ApiResponse.success(
        res,
        { preferences },
        "Preferences updated successfully"
      );
    }
  );

  createTestNotification = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { userId, type, channel } = req.body as TestNotificationBody;

      const notification = await notificationService.createTestNotification(
        userId,
        type,
        channel
      );

      if (!notification) {
  throw ApiError.conflict(
    "Test notification was not created — target user has this category disabled in preferences"
  );
}

      return ApiResponse.success(
        res,
        { notification },
        "Test notification created",
        201
      );
    }
  );
}

export const notificationController = new NotificationController();
