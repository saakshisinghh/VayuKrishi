import { Router } from 'express';
import * as AnalyticsController from '../controllers/analytics.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middlewares/auth';

const router = Router();

// ── Routes ────────────────────────────────────────────────────
// Auth/role checks now use the project's real middleware (same ones
// wired into the Phase 9 notifications module) instead of the
// non-verifying stubs the original draft shipped with.

/**
 * @route   GET /api/v1/analytics/overview
 * @desc    Platform KPIs
 * @access  Admin, Consultant, FPO Manager
 */
router.get(
  '/overview',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager'),
  AnalyticsController.getOverview
);

/**
 * @route   GET /api/v1/analytics/farms
 * @desc    Farm analytics
 * @access  Admin, Consultant, FPO Manager
 */
router.get(
  '/farms',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager'),
  AnalyticsController.getFarmAnalytics
);

/**
 * @route   GET /api/v1/analytics/crops
 * @desc    Crop recommendation analytics
 * @access  Admin, Consultant, FPO Manager
 */
router.get(
  '/crops',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager'),
  AnalyticsController.getCropAnalytics
);

/**
 * @route   GET /api/v1/analytics/diseases
 * @desc    Disease report analytics
 * @access  Admin, Consultant, FPO Manager
 */
router.get(
  '/diseases',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager'),
  AnalyticsController.getDiseaseAnalytics
);

/**
 * @route   GET /api/v1/analytics/market
 * @desc    Market price analytics
 * @access  Admin, Consultant, FPO Manager, Farmer
 */
router.get(
  '/market',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager', 'farmer'),
  AnalyticsController.getMarketAnalytics
);

/**
 * @route   GET /api/v1/analytics/schemes
 * @desc    Government scheme analytics
 * @access  Admin, Consultant, FPO Manager
 */
router.get(
  '/schemes',
  authenticate,
  requireRole('admin', 'consultant', 'fpo_manager'),
  AnalyticsController.getSchemeAnalytics
);

/**
 * @route   GET /api/v1/analytics/notifications
 * @desc    Notification engagement analytics
 * @access  Admin
 */
router.get(
  '/notifications',
  authenticate,
  requireRole('admin'),
  AnalyticsController.getNotificationAnalytics
);

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Role-scoped dashboard — farmers see own data, admins see platform
 * @access  All authenticated users
 */
router.get(
  '/dashboard',
  authenticate,
  AnalyticsController.getDashboard
);

export default router;
