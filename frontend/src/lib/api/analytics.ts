// src/lib/api/analytics.ts
import { api } from "./axios";
import type {
  AnalyticsSummary,
  KPIMetrics,
  ProfitTrendData,
  YieldTrendData,
  DiseaseAnalyticsData,
  MarketAnalyticsData,
  WaterAnalyticsData,
  TaskAnalyticsData,
} from "@/features/analytics/types";

export const fetchAnalyticsSummary = (): Promise<AnalyticsSummary> =>
  api.get("/analytics/summary").then((r) => r.data);

export const fetchKPIMetrics = (): Promise<KPIMetrics> =>
  api.get("/analytics/kpi").then((r) => r.data);

export const fetchProfitTrend = (): Promise<ProfitTrendData[]> =>
  api.get("/analytics/profit-trend").then((r) => r.data);

export const fetchYieldTrend = (): Promise<YieldTrendData[]> =>
  api.get("/analytics/yield-trend").then((r) => r.data);

export const fetchDiseaseAnalytics = (): Promise<DiseaseAnalyticsData[]> =>
  api.get("/analytics/disease").then((r) => r.data);

export const fetchMarketAnalytics = (): Promise<MarketAnalyticsData[]> =>
  api.get("/analytics/market").then((r) => r.data);

export const fetchWaterAnalytics = (): Promise<WaterAnalyticsData[]> =>
  api.get("/analytics/water").then((r) => r.data);

export const fetchTaskAnalytics = (): Promise<TaskAnalyticsData> =>
  api.get("/analytics/tasks").then((r) => r.data);
