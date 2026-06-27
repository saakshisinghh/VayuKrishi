// ── Types matching frontend/src/features/analytics/types/index.ts exactly ──
// This module is scoped to a single logged-in farmer (req.user.userId),
// unlike the platform-wide /modules/analytics built for Phase 10's admin
// dashboard. Several fields below have no real backend data source yet
// (no finance/water/task tracking modules exist in this project) and are
// explicitly stubbed at 0 / empty rather than fabricated, with a note on
// each. See PERSONAL_ANALYTICS_README.md for the full breakdown.

export interface AnalyticsSummary {
  farmPerformance: number; // STUB: no defined formula/data source yet
  productivityIndex: number; // STUB: no defined formula/data source yet
  profitabilityScore: number; // STUB: no finance module exists yet
  currentSeason: string; // REAL: derived from the farmer's most recent Farm.cropSeason
}

export interface MetricWithDelta {
  value: number;
  delta: number;
}

export interface KPIMetrics {
  revenue: MetricWithDelta; // STUB: no finance/transaction module exists yet
  yield: MetricWithDelta; // STUB: no harvest-outcome tracking exists yet (expectedYield is an estimate, not an outcome)
  farmHealth: MetricWithDelta; // STUB: no defined composite formula yet
  diseaseIncidents: MetricWithDelta; // REAL: count of this farmer's DiseaseReport documents
  waterSavings: MetricWithDelta; // STUB: no irrigation/water-usage module exists yet
  marketPerformance: MetricWithDelta; // STUB: no buy/sell transaction module exists yet
}

export interface ProfitTrendData {
  month: string;
  actual: number;
  projected: number;
}

export interface YieldTrendData {
  crop: string;
  yield: number;
}

export interface DiseaseAnalyticsData {
  week: string;
  detected: number;
  treated: number;
}

export interface MarketAnalyticsData {
  month: string;
  sold: number;
  avgPrice: number;
}

export interface WaterAnalyticsData {
  week: string;
  used: number;
}

export interface TaskAnalyticsData {
  completionRate: number;
  completed: number;
  inProgress: number;
  pending: number;
}
