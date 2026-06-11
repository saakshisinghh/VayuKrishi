export interface CropPrice {
  cropId: string;
  cropName: string;
  currentPrice: number;
  unit: string;
  change7d: number; // absolute change
  change7dPercent: number;
  change30d: number;
  change30dPercent: number;
  trend: "up" | "down" | "stable";
  priceHistory: PricePoint[];
  forecast30d: PricePoint[];
  market: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface MarketData {
  topCrops: CropPrice[];
  lastUpdated: string;
  marketSentiment: "bullish" | "bearish" | "neutral";
}
