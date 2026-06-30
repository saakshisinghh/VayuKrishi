import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './socket.types';
import { ConnectionService } from './services/connection.service';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerNotificationSocket(io: AppServer, socket: AuthenticatedSocket): void {
  const { _id: userId } = socket.user;

  // ── notification:read ─────────────────────────────────────
  socket.on('notification:read', async (notificationId: string) => {
    try {
      if (!notificationId || typeof notificationId !== 'string') return;

      // Persist read status (wire to your NotificationService)
      // await NotificationService.markRead(notificationId, userId);

      // Reflect to all other tabs/devices of same user
      socket.to(`user:${userId}`).emit('notification:read', notificationId);

      console.info(`[NotificationSocket] userId=${userId} marked read notificationId=${notificationId}`);
    } catch (err) {
      console.error('[NotificationSocket] notification:read error', err);
      socket.emit('error', { message: 'Failed to mark notification as read', code: 'NOTIFICATION_READ_FAILED' });
    }
  });

  // ── notification:all-read ─────────────────────────────────
  socket.on('notification:all-read', async () => {
    try {
      // await NotificationService.markAllRead(userId);
      socket.to(`user:${userId}`).emit('notification:all-read');
      console.info(`[NotificationSocket] userId=${userId} marked all read`);
    } catch (err) {
      console.error('[NotificationSocket] notification:all-read error', err);
      socket.emit('error', { message: 'Failed to mark all notifications as read', code: 'NOTIFICATION_ALL_READ_FAILED' });
    }
  });

  // ── notification:test (development helper) ────────────────
  socket.on('notification:test', () => {
    if (process.env.NODE_ENV === 'production') return;

    socket.emit('notification:new', {
      notificationId: `test_${Date.now()}`,
      title: 'Test Notification',
      message: 'Real-time socket is working correctly.',
      type: 'info',
      priority: 'low',
      createdAt: new Date().toISOString(),
    });

    console.info(`[NotificationSocket] Test notification sent to userId=${userId}`);
  });
}
