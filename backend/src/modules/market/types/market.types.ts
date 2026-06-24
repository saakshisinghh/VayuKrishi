import { Types } from "mongoose";

export type MarketSource = "AGMARKNET" | "MOCK" | "MANUAL" | "GOV_API";

/**
 * Plain (non-Mongoose-document) shape of a market price record.
 * Used across services/repositories/controllers for type safety.
 */
export interface IMarketPrice {
  _id?: Types.ObjectId | string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  arrivalDate: Date;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: MarketSource;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PriceFilters {
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
}

export interface DateRangeFilters {
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CommoditySummary {
  commodity: string;
  currentPrice: number;
  highestMarket: {
    market: string;
    state: string;
    modalPrice: number;
  } | null;
  lowestMarket: {
    market: string;
    state: string;
    modalPrice: number;
  } | null;
  averagePrice: number;
  totalMarketsReporting: number;
  lastUpdated: Date | null;
}

export interface TrendingCommodityItem {
  commodity: string;
  previousAvgPrice: number;
  currentAvgPrice: number;
  changeAmount: number;
  changePercent: number;
  recordCount: number;
}

export interface TrendingResult {
  topGainers: TrendingCommodityItem[];
  topLosers: TrendingCommodityItem[];
  mostTraded: { commodity: string; recordCount: number }[];
  topMarkets: { market: string; state: string; recordCount: number }[];
  generatedAt: Date;
}

export interface SyncResult {
  inserted: number;
  source: MarketSource;
  syncedAt: Date;
}
