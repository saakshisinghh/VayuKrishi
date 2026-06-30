import { Router, Request, Response, NextFunction } from 'express';
import * as RealtimeController from '../controllers/realtime.controller';

const router = Router();

// ── Stub middleware (replace with your real auth middleware) ──
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as Request & { user?: unknown }).user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized', timestamp: new Date().toISOString() });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as Request & { user?: { role: string } }).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden', timestamp: new Date().toISOString() });
  }
  next();
}

/**
 * @route   GET /api/v1/realtime/status
 * @desc    Socket server health + metrics
 * @access  Admin
 */
router.get('/status', requireAuth, requireAdmin, RealtimeController.getRealtimeStatus);

/**
 * @route   GET /api/v1/realtime/online-users
 * @desc    List online user IDs and count
 * @access  Admin
 */
router.get('/online-users', requireAuth, requireAdmin, RealtimeController.getOnlineUsers);

/**
 * @route   GET /api/v1/realtime/presence/:userId
 * @desc    Full presence record for a specific user
 * @access  Admin
 */
router.get('/presence/:userId', requireAuth, requireAdmin, RealtimeController.getUserPresence);
/**
 * @route   GET /api/v1/realtime/trigger-test/market-sync
 * @desc    TEMPORARY — manually trigger market-sync for local testing
 * @access  None (REMOVE before deploying)
 */

export default router;
