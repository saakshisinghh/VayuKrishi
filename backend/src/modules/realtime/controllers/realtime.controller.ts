import { Request, Response, NextFunction } from 'express';
import { ConnectionService } from '../../../sockets/services/connection.service';
import { getIo } from '../../../sockets/socket-server';
function ok(res: Response, data: unknown, message = 'Success') {
  return res.status(200).json({ success: true, message, data, timestamp: new Date().toISOString() });
}

function fail(res: Response, message: string, status = 500) {
  return res.status(status).json({ success: false, message, error: null, timestamp: new Date().toISOString() });
}

/**
 * GET /api/v1/realtime/online-users
 * Admin only — returns list of online user IDs and count.
 */
export async function getOnlineUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const [onlineUserIds, count] = await Promise.all([
      ConnectionService.getOnlineUsers(),
      ConnectionService.getOnlineCount(),
    ]);

    return ok(res, { count, userIds: onlineUserIds });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/realtime/status
 * Admin only — returns socket server health metrics.
 */
export async function getRealtimeStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const io = getIo();
    const [onlineCount, socketsInServer] = await Promise.all([
      ConnectionService.getOnlineCount(),
      io.sockets.sockets.size,
    ]);

    return ok(res, {
      status: 'healthy',
      onlineUsers: onlineCount,
      activeSockets: socketsInServer,
      redisAdapter: io.sockets.adapter.constructor.name,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/realtime/presence/:userId
 * Admin only — returns full presence record for a user.
 */
export async function getUserPresence(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    if (!userId) return fail(res, 'userId is required', 400);

    const presence = await ConnectionService.getUserPresence(userId);
    if (!presence) return ok(res, { isOnline: false, userId });

    return ok(res, presence);
  } catch (err) {
    next(err);
  }
}
/**
 * GET /api/v1/realtime/trigger-test/market-sync
 * TEMPORARY — local testing only. Manually triggers market-sync so its
 * socket emits can be tested without waiting for the 6-hour cron.
 * REMOVE THIS ROUTE before deploying.
 */
