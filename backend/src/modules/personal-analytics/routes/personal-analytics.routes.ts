import { Router } from "express";
import * as PersonalAnalyticsController from "../controllers/personal-analytics.controller";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

/**
 * These routes are mounted at the SAME /api/v1/analytics prefix as the
 * platform-wide admin analytics module (modules/analytics), but use
 * different path segments (summary, kpi, profit-trend, yield-trend,
 * disease, market, water, tasks) so there is no collision with that
 * module's routes (overview, farms, crops, diseases, schemes,
 * notifications, dashboard). This module is scoped to the logged-in
 * farmer (req.user.userId) and matches exactly what the existing
 * frontend (frontend/src/lib/api/analytics.ts) already calls.
 *
 * Any authenticated user can view their own personal analytics — no
 * role restriction, unlike the admin module.
 */

router.get("/summary", authenticate, PersonalAnalyticsController.getSummary);
router.get("/kpi", authenticate, PersonalAnalyticsController.getKPIMetrics);
router.get("/profit-trend", authenticate, PersonalAnalyticsController.getProfitTrend);
router.get("/yield-trend", authenticate, PersonalAnalyticsController.getYieldTrend);
router.get("/disease", authenticate, PersonalAnalyticsController.getDiseaseAnalytics);
router.get("/market", authenticate, PersonalAnalyticsController.getMarketAnalytics);
router.get("/water", authenticate, PersonalAnalyticsController.getWaterAnalytics);
router.get("/tasks", authenticate, PersonalAnalyticsController.getTaskAnalytics);

export default router;
