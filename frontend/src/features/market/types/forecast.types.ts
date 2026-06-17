export interface PriceForecast {
  cropId: string;
  crop: string;
  currentPrice: number;
  unit: string;
  forecasts: ForecastPoint[];
  forecast7d: ForecastSummary;
  forecast30d: ForecastSummary;
  confidenceScore: number;
  aiRecommendation: AIRecommendation;
  priceHistory: PriceHistoryPoint[];
}

export interface ForecastPoint {
  date: string;
  predictedPrice: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface ForecastSummary {
  expectedPrice: number;
  changePercent: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  trend: "bullish" | "bearish" | "neutral";
}

export interface AIRecommendation {
  action: "sell_now" | "hold_7d" | "hold_30d" | "sell_partial";
  holdDays?: number;
  expectedGain: number;
  riskLevel: "low" | "medium" | "high";
  reasoning: string;
  confidence: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

export interface SellDecision {
  cropId: string;
  crop: string;
  currentPrice: number;
  options: SellOption[];
  recommendation: "sell_now" | "hold_7d" | "hold_30d";
  riskScore: number;
  profitDifference: number;
}

export interface SellOption {
  type: "sell_now" | "hold_7d" | "hold_30d";
  expectedPrice: number;
  expectedProfit: number;
  profitDifference: number;
  riskScore: number;
  probability: number;
}

export interface SeasonalTrend {
  cropId: string;
  crop: string;
  monthly: MonthlyPrice[];
  peakMonth: string;
  lowMonth: string;
  seasonalPattern: string;
}

export interface MonthlyPrice {
  month: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  demandIndex: number;
}
