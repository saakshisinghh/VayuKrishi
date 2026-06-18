// src/lib/queries/analytics.ts
export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: () => [...analyticsKeys.all, "summary"] as const,
  kpi: () => [...analyticsKeys.all, "kpi"] as const,
  profitTrend: () => [...analyticsKeys.all, "profit-trend"] as const,
  yieldTrend: () => [...analyticsKeys.all, "yield-trend"] as const,
  disease: () => [...analyticsKeys.all, "disease"] as const,
  market: () => [...analyticsKeys.all, "market"] as const,
  water: () => [...analyticsKeys.all, "water"] as const,
  tasks: () => [...analyticsKeys.all, "tasks"] as const,
};
