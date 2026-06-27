import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as AnalyticsService from '../services/analytics.service';
import {
  OverviewQuerySchema,
  FarmAnalyticsQuerySchema,
  CropAnalyticsQuerySchema,
  DiseaseAnalyticsQuerySchema,
  MarketAnalyticsQuerySchema,
  SchemeAnalyticsQuerySchema,
  NotificationAnalyticsQuerySchema,
} from '../validators/analytics.validators';
import { AnalyticsFilters } from '../types/analytics.types';

// ── Response helpers ──────────────────────────────────────────
function ok(res: Response, data: unknown, message = 'Success') {
  return res.status(200).json({ success: true, message, data, timestamp: new Date().toISOString() });
}

function fail(res: Response, message: string, status = 500, error?: unknown) {
  return res.status(status).json({
    success: false,
    message,
    error: error ?? null,
    timestamp: new Date().toISOString(),
  });
}

// ── Zod parse helper ──────────────────────────────────────────
function parseQuery<T>(schema: { parse: (v: unknown) => T }, query: unknown, res: Response): T | null {
  try {
    return schema.parse(query);
  } catch (err) {
    if (err instanceof ZodError) {
      fail(res, 'Validation error', 400, err.flatten());
      return null;
    }
    throw err;
  }
}

// ── GET /overview ─────────────────────────────────────────────
export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(OverviewQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getOverview(q as AnalyticsFilters);
    return ok(res, data, 'Platform overview retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /farms ────────────────────────────────────────────────
export async function getFarmAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(FarmAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getFarmAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Farm analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /crops ────────────────────────────────────────────────
export async function getCropAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(CropAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getCropAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Crop analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /diseases ─────────────────────────────────────────────
export async function getDiseaseAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(DiseaseAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getDiseaseAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Disease analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /market ───────────────────────────────────────────────
export async function getMarketAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(MarketAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getMarketAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Market analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /schemes ──────────────────────────────────────────────
export async function getSchemeAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(SchemeAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getSchemeAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Scheme analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /notifications ────────────────────────────────────────
export async function getNotificationAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const q = parseQuery(NotificationAnalyticsQuerySchema, req.query, res);
    if (!q) return;
    const data = await AnalyticsService.getNotificationAnalytics(q as AnalyticsFilters);
    return ok(res, data, 'Notification analytics retrieved');
  } catch (err) {
    next(err);
  }
}

// ── GET /dashboard ────────────────────────────────────────────
export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    // Populated by the real auth middleware (middleware/auth.middleware.ts):
    // req.user = { userId, role } — NOT { _id, role }.
    const user = (req as Request & { user?: { userId: string; role: string } }).user;
    if (!user) return fail(res, 'Unauthorized', 401);

    const role = user.role as 'farmer' | 'consultant' | 'fpo_manager' | 'admin';
    const filters = parseQuery(OverviewQuerySchema, req.query, res);
    if (!filters) return;

    const data = await AnalyticsService.getDashboardAnalytics(role, String(user.userId), filters as AnalyticsFilters);
    return ok(res, data, 'Dashboard retrieved');
  } catch (err) {
    next(err);
  }
}
