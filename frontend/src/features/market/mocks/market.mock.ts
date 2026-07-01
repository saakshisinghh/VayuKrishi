import type {
  MarketPrice,
  MarketSummary,
  BestMarket,
  MarketAlert,
  MarketLocation,
} from "../types/market.types";
import type {
  PriceForecast,
  SellDecision,
  SeasonalTrend,
} from "../types/forecast.types";
import type { DemandInsight, DemandSummary } from "../types/demand.types";
import type { CropComparisonData } from "../types/comparison.types";

const now = new Date().toISOString();

const CROPS = [
  { id: "wheat", name: "Wheat", emoji: "🌾" },
  { id: "rice", name: "Rice", emoji: "🌱" },
  { id: "cotton", name: "Cotton", emoji: "☁️" },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋" },
  { id: "soybean", name: "Soybean", emoji: "🫘" },
];

export const mockMarketPrices: MarketPrice[] = CROPS.map((c, i) => ({
  id: `price-${c.id}`,
  crop: c.name,
  cropId: c.id,
  currentPrice: 2000 + i * 350,
  previousPrice: 1950 + i * 350,
  dailyChange: 50 - i * 5,
  dailyChangePercent: 2.5 - i * 0.3,
  market: ["Pune APMC", "Nashik Mandi", "Indore Market", "Ludhiana Mandi", "Bhopal APMC"][i],
  marketId: `market-${i + 1}`,
  volume: 1200 - i * 100,
  unit: "quintal",
  updatedAt: now,
  trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "stable",
}));

export const mockMarketSummary: MarketSummary = {
  totalMarkets: 248,
  topGainer: { crop: "Wheat", changePercent: 5.4, price: 2350 },
  topLoser: { crop: "Cotton", changePercent: -3.1, price: 2700 },
  highestDemandCrop: { crop: "Soybean", demandScore: 87 },
  bestSellingRegion: { region: "Maharashtra", volume: 15400 },
  marketStatus: "open",
  priceChangeSummary: { gainers: 14, losers: 6, unchanged: 3 },
  demandIndex: 72,
};

export const mockMarketLocations: MarketLocation[] = [
  {
    id: "loc-1",
    name: "Pune APMC Market",
    state: "Maharashtra",
    district: "Pune",
    latitude: 18.5204,
    longitude: 73.8567,
    distance: 12.4,
    type: "APMC",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    timings: "6:00 AM - 2:00 PM",
    topCrops: ["Wheat", "Onion", "Tomato"],
  },
  {
    id: "loc-2",
    name: "Nashik Wholesale Market",
    state: "Maharashtra",
    district: "Nashik",
    latitude: 19.9975,
    longitude: 73.7898,
    distance: 28.7,
    type: "Wholesale",
    operatingDays: ["Mon", "Wed", "Fri"],
    timings: "7:00 AM - 1:00 PM",
    topCrops: ["Grapes", "Onion"],
  },
  {
    id: "loc-3",
    name: "Indore Retail Hub",
    state: "Madhya Pradesh",
    district: "Indore",
    latitude: 22.7196,
    longitude: 75.8577,
    distance: 45.2,
    type: "Retail",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    timings: "9:00 AM - 8:00 PM",
    topCrops: ["Soybean", "Wheat"],
  },
  {
    id: "loc-4",
    name: "JNPT Export Hub",
    state: "Maharashtra",
    district: "Raigad",
    latitude: 18.9489,
    longitude: 72.9486,
    distance: 110.5,
    type: "Export",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    timings: "24 hours",
    topCrops: ["Cotton", "Rice"],
  },
];

export const mockBestMarkets: BestMarket[] = [
  {
    market: mockMarketLocations[0],
    expectedPrice: 2380,
    transportCost: 120,
    netProfit: 2260,
    rating: 4.6,
    reasons: ["Highest price in 50km radius", "Low transport cost", "High demand this week"],
    cropId: "wheat",
    crop: "Wheat",
  },
];

export const mockMarketAlerts: MarketAlert[] = [
  {
    id: "alert-1",
    type: "price_increase",
    severity: "info",
    crop: "Wheat",
    cropId: "wheat",
    title: "Wheat prices rising",
    message: "Wheat prices up 5.4% this week in Maharashtra markets.",
    changePercent: 5.4,
    createdAt: now,
    read: false,
  },
  {
    id: "alert-2",
    type: "demand_high",
    severity: "warning",
    crop: "Soybean",
    cropId: "soybean",
    title: "High demand for Soybean",
    message: "Demand index for Soybean has crossed 85 in your region.",
    createdAt: now,
    read: false,
  },
  {
    id: "alert-3",
    type: "price_decrease",
    severity: "critical",
    crop: "Cotton",
    cropId: "cotton",
    title: "Cotton prices falling",
    message: "Cotton prices dropped 3.1% — consider holding before selling.",
    changePercent: -3.1,
    createdAt: now,
    read: true,
  },
];

function buildForecastPoints(basePrice: number, days: number): { date: string; predictedPrice: number; lowerBound: number; upperBound: number; confidence: number }[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const drift = basePrice * (1 + i * 0.004);
    return {
      date: date.toISOString().split("T")[0],
      predictedPrice: Math.round(drift),
      lowerBound: Math.round(drift * 0.94),
      upperBound: Math.round(drift * 1.06),
      confidence: Math.max(60, 95 - i),
    };
  });
}

export function mockGetForecast(cropId: string): PriceForecast {
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  const basePrice = 2200;
  return {
    cropId: crop.id,
    crop: crop.name,
    currentPrice: basePrice,
    unit: "quintal",
    forecasts: buildForecastPoints(basePrice, 30),
    forecast7d: { expectedPrice: 2310, changePercent: 5.0, minPrice: 2270, maxPrice: 2350, confidence: 88, trend: "bullish" },
    forecast30d: { expectedPrice: 2480, changePercent: 12.7, minPrice: 2300, maxPrice: 2600, confidence: 71, trend: "bullish" },
    confidenceScore: 82,
    aiRecommendation: {
      action: "hold_7d",
      holdDays: 7,
      expectedGain: 110,
      riskLevel: "low",
      reasoning: "Prices are trending upward due to seasonal demand and lower supply from key regions.",
      confidence: 84,
    },
    priceHistory: Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (14 - i));
      return {
        date: date.toISOString().split("T")[0],
        price: Math.round(basePrice * (0.92 + i * 0.006)),
        volume: 800 + i * 20,
      };
    }),
  };
}

export function mockGetSellRecommendation(cropId: string): SellDecision {
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  return {
    cropId: crop.id,
    crop: crop.name,
    currentPrice: 2200,
    options: [
      { type: "sell_now", expectedPrice: 2200, expectedProfit: 2150, profitDifference: 0, riskScore: 10, probability: 100 },
      { type: "hold_7d", expectedPrice: 2310, expectedProfit: 2260, profitDifference: 110, riskScore: 28, probability: 78 },
      { type: "hold_30d", expectedPrice: 2480, expectedProfit: 2410, profitDifference: 260, riskScore: 52, probability: 61 },
    ],
    recommendation: "hold_7d",
    riskScore: 28,
    profitDifference: 110,
  };
}

export function mockGetSeasonalTrend(cropId: string): SeasonalTrend {
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    cropId: crop.id,
    crop: crop.name,
    monthly: months.map((m, i) => ({
      month: m,
      avgPrice: 2000 + Math.round(Math.sin(i / 2) * 200),
      minPrice: 1850 + Math.round(Math.sin(i / 2) * 150),
      maxPrice: 2300 + Math.round(Math.sin(i / 2) * 250),
      demandIndex: 50 + Math.round(Math.cos(i / 3) * 30),
    })),
    peakMonth: "Oct",
    lowMonth: "Apr",
    seasonalPattern: "Prices typically peak post-harvest in October and dip in April due to oversupply.",
  };
}

export function mockGetCropComparison(cropIds: string[]): CropComparisonData {
  const deduped = Array.from(new Set(cropIds));
  const selected = deduped.length > 0 ? deduped : CROPS.slice(0, 3).map((c) => c.id);
  const crops = selected.map((id, i) => {
    const usedIds = new Set(selected.slice(0, i));
    const crop =
      CROPS.find((c) => c.id === id) ??
      CROPS.find((c) => !usedIds.has(c.id)) ??
      CROPS[i % CROPS.length];
    const base = 2000 + i * 300;
    return {
      cropId: crop.id,
      crop: crop.name,
      emoji: crop.emoji,
      currentPrice: base,
      forecastPrice7d: Math.round(base * 1.04),
      forecastPrice30d: Math.round(base * 1.11),
      priceChange7d: 4.0,
      priceChange30d: 11.0,
      demandScore: 60 + i * 8,
      riskScore: 20 + i * 5,
      profitPotential: 65 + i * 6,
      trend: (i % 2 === 0 ? "up" : "stable") as "up" | "down" | "stable",
      recommendation: (i === 0 ? "sell" : i === 1 ? "hold" : "buy") as "sell" | "hold" | "buy",
      chartData: Array.from({ length: 7 }, (_, d) => ({
        date: new Date(Date.now() - (6 - d) * 86400000).toISOString().split("T")[0],
        price: Math.round(base * (0.97 + d * 0.01)),
      })),
    };
  });

  return {
    crops,
    metrics: [
      { label: "Current Price", key: "currentPrice", format: "currency", higherIsBetter: true },
      { label: "Demand Score", key: "demandScore", format: "score", higherIsBetter: true },
      { label: "Risk Score", key: "riskScore", format: "score", higherIsBetter: false },
      { label: "Profit Potential", key: "profitPotential", format: "percent", higherIsBetter: true },
    ],
    winner: { cropId: crops[0].cropId, crop: crops[0].crop, reasons: ["Highest demand score", "Lowest risk", "Strong 30d forecast"] },
    updatedAt: now,
  };
}

export function mockGetDemandInsights(cropId?: string): DemandInsight[] {
  const list = cropId ? CROPS.filter((c) => c.id === cropId) : CROPS;
  return list.map((c, i) => ({
    cropId: c.id,
    crop: c.name,
    demandScore: 60 + i * 7,
    demandTrend: i % 3 === 0 ? "rising" : i % 3 === 1 ? "falling" : "stable",
    demandChangePercent: 8 - i * 2,
    category: i === 0 ? "high" : i === 1 ? "emerging" : "stable",
    topRegions: [
      { region: "Pune", state: "Maharashtra", demandScore: 80, avgPrice: 2200, volume: 4000 },
      { region: "Nashik", state: "Maharashtra", demandScore: 74, avgPrice: 2150, volume: 3200 },
    ],
    weeklyTrend: Array.from({ length: 7 }, (_, d) => ({
      date: new Date(Date.now() - (6 - d) * 86400000).toISOString().split("T")[0],
      score: 60 + d * 2,
      volume: 1000 + d * 50,
    })),
    monthlyTrend: Array.from({ length: 6 }, (_, m) => ({
      date: new Date(Date.now() - (5 - m) * 30 * 86400000).toISOString().split("T")[0],
      score: 55 + m * 4,
      volume: 3000 + m * 200,
    })),
    drivers: ["Festival season demand", "Export orders increasing", "Lower regional supply"],
  }));
}

export function mockGetDemandSummary(): DemandSummary {
  const insights = mockGetDemandInsights();
  return {
    highDemandCrops: insights.filter((d) => d.category === "high"),
    emergingCrops: insights.filter((d) => d.category === "emerging"),
    decliningCrops: insights.filter((d) => d.category === "declining"),
    regionalHotspots: [
      { region: "Pune", state: "Maharashtra", demandScore: 80, avgPrice: 2200, volume: 4000 },
      { region: "Indore", state: "Madhya Pradesh", demandScore: 76, avgPrice: 2100, volume: 3600 },
    ],
    overallMarketDemandIndex: 72,
  };
}