import mongoose from "mongoose";
import { Farm } from "../../farms/farm.model";
import DiseaseReport from "../../disease-detection/disease.model";
import { Recommendation } from "../../crop-recommendation/recommendation.model";
import { MarketPrice } from "../../market/market.model";
import {
  AnalyticsSummary,
  KPIMetrics,
  ProfitTrendData,
  YieldTrendData,
  DiseaseAnalyticsData,
  MarketAnalyticsData,
  WaterAnalyticsData,
  TaskAnalyticsData,
} from "../types/personal-analytics.types";

const WEEKS_LOOKBACK = 8;
const MONTHS_LOOKBACK = 6;

function weekLabel(date: Date): string {
  // ISO-ish "YYYY-Www" label, grouped by the Monday-starting week.
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back up to Monday
  const year = d.getFullYear();
  const firstJan = new Date(year, 0, 1);
  const week = Math.ceil(((d.getTime() - firstJan.getTime()) / 86400000 + firstJan.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function monthLabel(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Pulls the leading number out of a free-text yield estimate like
 * "25 quintal/acre". Returns null (not 0 or NaN) if no number is found,
 * so callers can skip the entry instead of plotting a fake zero.
 */
function parseLeadingNumber(text: string): number | null {
  const match = /(\d+(\.\d+)?)/.exec(text);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
}

// ── Summary ───────────────────────────────────────────────────
export async function getSummary(userId: string): Promise<AnalyticsSummary> {
  const latestFarm = await Farm.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .select("cropSeason")
    .lean();

  return {
    farmPerformance: 0, // STUB — no formula defined
    productivityIndex: 0, // STUB — no formula defined
    profitabilityScore: 0, // STUB — no finance module
    currentSeason: latestFarm?.cropSeason ?? "",
  };
}

// ── KPI Metrics ───────────────────────────────────────────────
export async function getKPIMetrics(userId: string): Promise<KPIMetrics> {
  const uid = new mongoose.Types.ObjectId(userId);

  const totalDiseaseReports = await DiseaseReport.countDocuments({ userId: uid });

  const zero: { value: number; delta: number } = { value: 0, delta: 0 };

  return {
    revenue: { ...zero }, // STUB — no finance module
    yield: { ...zero }, // STUB — no harvest-outcome tracking
    farmHealth: { ...zero }, // STUB — no formula defined
    diseaseIncidents: { value: totalDiseaseReports, delta: 0 }, // REAL count; delta needs a prior-period comparison, left at 0 until a baseline period is defined
    waterSavings: { ...zero }, // STUB — no water-usage module
    marketPerformance: { ...zero }, // STUB — no transaction module
  };
}

// ── Profit Trend ──────────────────────────────────────────────
export async function getProfitTrend(_userId: string): Promise<ProfitTrendData[]> {
  // STUB — no finance/transaction module exists yet. Returns an empty
  // array (not fabricated numbers) so the chart renders with no data
  // rather than crashing or showing fake revenue.
  return [];
}

// ── Yield Trend ───────────────────────────────────────────────
// Uses Recommendation.recommendations[].expectedYield, a free-text AI
// *estimate* ("25 quintal/acre"), not an actual harvested outcome —
// there is no harvest-logging module. Treat this as an approximation.
export async function getYieldTrend(userId: string): Promise<YieldTrendData[]> {
  const uid = new mongoose.Types.ObjectId(userId);

  const recs = await Recommendation.find({ userId: uid, status: "completed" })
    .select("recommendations")
    .lean();

  const byCrop = new Map<string, { sum: number; count: number }>();

  for (const rec of recs) {
    for (const item of rec.recommendations ?? []) {
      const parsed = parseLeadingNumber(item.expectedYield ?? "");
      if (parsed === null) continue;
      const existing = byCrop.get(item.cropName) ?? { sum: 0, count: 0 };
      existing.sum += parsed;
      existing.count += 1;
      byCrop.set(item.cropName, existing);
    }
  }

  return Array.from(byCrop.entries()).map(([crop, { sum, count }]) => ({
    crop,
    yield: Math.round((sum / count) * 100) / 100,
  }));
}

// ── Disease Analytics ─────────────────────────────────────────
// "detected" is real (DiseaseReport count per week). "treated" has no
// backing data — there is no treatment-completion field on
// DiseaseReport — so it is always 0, not fabricated.
export async function getDiseaseAnalytics(userId: string): Promise<DiseaseAnalyticsData[]> {
  const uid = new mongoose.Types.ObjectId(userId);
  const since = new Date();
  since.setDate(since.getDate() - WEEKS_LOOKBACK * 7);

  const reports = await DiseaseReport.find({ userId: uid, createdAt: { $gte: since } })
    .select("createdAt")
    .lean();

  const byWeek = new Map<string, number>();
  for (const r of reports) {
    const label = weekLabel(r.createdAt);
    byWeek.set(label, (byWeek.get(label) ?? 0) + 1);
  }

  return Array.from(byWeek.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([week, detected]) => ({ week, detected, treated: 0 }));
}

// ── Market Analytics ──────────────────────────────────────────
// "avgPrice" is real (MarketPrice.modalPrice averaged per month, scoped
// to crops this farmer actually grows). "sold" (transaction volume) has
// no backing data — there is no buy/sell/order module — so it is always
// 0, not fabricated.
export async function getMarketAnalytics(userId: string): Promise<MarketAnalyticsData[]> {
  const uid = new mongoose.Types.ObjectId(userId);
  const since = new Date();
  since.setMonth(since.getMonth() - MONTHS_LOOKBACK);

  const farms = await Farm.find({ userId: uid }).select("currentCrop").lean();
  const crops = [...new Set(farms.map((f) => f.currentCrop).filter(Boolean))];

  if (crops.length === 0) return [];

  const prices = await MarketPrice.find({
    commodity: { $in: crops.map((c) => new RegExp(`^${c}$`, "i")) },
    arrivalDate: { $gte: since },
  })
    .select("modalPrice arrivalDate")
    .lean();

  const byMonth = new Map<string, { sum: number; count: number }>();
  for (const p of prices) {
    const label = monthLabel(p.arrivalDate);
    const existing = byMonth.get(label) ?? { sum: 0, count: 0 };
    existing.sum += p.modalPrice;
    existing.count += 1;
    byMonth.set(label, existing);
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, { sum, count }]) => ({
      month,
      sold: 0, // STUB — no transaction module
      avgPrice: Math.round((sum / count) * 100) / 100,
    }));
}

// ── Water Analytics ───────────────────────────────────────────
export async function getWaterAnalytics(_userId: string): Promise<WaterAnalyticsData[]> {
  // STUB — no irrigation/water-usage module exists yet.
  return [];
}

// ── Task Analytics ────────────────────────────────────────────
export async function getTaskAnalytics(_userId: string): Promise<TaskAnalyticsData> {
  // STUB — no task/todo module exists yet.
  return { completionRate: 0, completed: 0, inProgress: 0, pending: 0 };
}
