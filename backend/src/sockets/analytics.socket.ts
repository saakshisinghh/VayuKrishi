import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './socket.types';
import { requireSocketRole } from './middleware/socket-auth.middleware';
import { ConnectionService } from './services/connection.service';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerAnalyticsSocket(io: AppServer, socket: AuthenticatedSocket): void {
  const { _id: userId, role } = socket.user;

  // ── analytics:subscribe (admin / consultant / fpo_manager) ─
  socket.on('analytics:subscribe', async () => {
    if (!requireSocketRole(socket, 'admin', 'consultant', 'fpo_manager')) return;

    await socket.join(`role:${role}`);
    await socket.join('analytics:subscribers');

    // Send immediate online-user count snapshot
    const onlineCount = await ConnectionService.getOnlineCount();
    socket.emit('analytics:update', {
      metric: 'online_users',
      value: onlineCount,
      timestamp: new Date().toISOString(),
    });

    console.info(`[AnalyticsSocket] userId=${userId} subscribed to analytics`);
  });

  // ── ping / pong (connection health) ──────────────────────
  socket.on('ping', () => {
    socket.emit('pong', Date.now());
  });
}

/**
 * Broadcast a real-time analytics metric update to all analytics subscribers.
 * Called from background jobs (e.g. after a daily snapshot).
 */
export function broadcastAnalyticsUpdate(
  io: AppServer,
  metric: string,
  value: number,
  delta?: number
): void {
  io.to('analytics:subscribers').emit('analytics:update', {
    metric,
    value,
    delta,
    timestamp: new Date().toISOString(),
  });
}
