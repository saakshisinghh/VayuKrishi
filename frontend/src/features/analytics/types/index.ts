export interface AnalyticsSummary {
  farmPerformance: number;
  productivityIndex: number;
  profitabilityScore: number;
  currentSeason: string;
}

export interface MetricWithDelta {
  value: number;
  delta: number;
}

export interface KPIMetrics {
  revenue: MetricWithDelta;
  yield: MetricWithDelta;
  farmHealth: MetricWithDelta;
  diseaseIncidents: MetricWithDelta;
  waterSavings: MetricWithDelta;
  marketPerformance: MetricWithDelta;
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
