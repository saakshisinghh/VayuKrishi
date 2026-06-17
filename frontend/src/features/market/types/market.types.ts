export interface MarketPrice {
  id: string;
  crop: string;
  cropId: string;
  currentPrice: number;
  previousPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  market: string;
  marketId: string;
  volume: number;
  unit: string;
  updatedAt: string;
  trend: "up" | "down" | "stable";
}

export interface MarketSummary {
  totalMarkets: number;
  topGainer: { crop: string; changePercent: number; price: number };
  topLoser: { crop: string; changePercent: number; price: number };
  highestDemandCrop: { crop: string; demandScore: number };
  bestSellingRegion: { region: string; volume: number };
  marketStatus: "open" | "closed" | "pre-market";
  priceChangeSummary: { gainers: number; losers: number; unchanged: number };
  demandIndex: number;
}

export interface MarketLocation {
  id: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  distance: number;
  type: "APMC" | "Wholesale" | "Retail" | "Export";
  operatingDays: string[];
  timings: string;
  topCrops: string[];
}

export interface BestMarket {
  market: MarketLocation;
  expectedPrice: number;
  transportCost: number;
  netProfit: number;
  rating: number;
  reasons: string[];
  cropId: string;
  crop: string;
}

export interface MarketAlert {
  id: string;
  type: "price_increase" | "price_decrease" | "demand_high" | "opportunity" | "warning";
  severity: "info" | "warning" | "critical";
  crop: string;
  cropId: string;
  title: string;
  message: string;
  changePercent?: number;
  createdAt: string;
  read: boolean;
}

export interface MarketFilters {
  search: string;
  state: string;
  crop: string;
  sortBy: "price" | "change" | "volume" | "market";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface CropComparisonItem {
  cropId: string;
  crop: string;
  currentPrice: number;
  forecastPrice7d: number;
  forecastPrice30d: number;
  demandScore: number;
  riskScore: number;
  profitPotential: number;
  trend: "up" | "down" | "stable";
  recommendation: "buy" | "sell" | "hold";
}
