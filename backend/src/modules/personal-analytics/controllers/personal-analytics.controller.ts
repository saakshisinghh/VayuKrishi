import { Request, Response, NextFunction } from "express";
import * as PersonalAnalyticsService from "../services/personal-analytics.service";

function getUserId(req: Request): string {
  const user = (req as Request & { user?: { userId: string } }).user;
  if (!user) throw new Error("Unauthenticated request reached controller without user");
  return String(user.userId);
}

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getSummary(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getKPIMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getKPIMetrics(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getProfitTrend(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getProfitTrend(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getYieldTrend(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getYieldTrend(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getDiseaseAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getDiseaseAnalytics(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getMarketAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getMarketAnalytics(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getWaterAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getWaterAnalytics(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getTaskAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PersonalAnalyticsService.getTaskAnalytics(getUserId(req));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
