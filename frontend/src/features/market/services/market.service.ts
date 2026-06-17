// import { apiClient as axios } from "@/lib/api/axios";
// import type { MarketPrice, MarketSummary, BestMarket, MarketAlert, MarketFilters, MarketLocation } from "../types/market.types";

// export const marketService = {
//   async getMarketPrices(filters?: Partial<MarketFilters>): Promise<{
//     data: MarketPrice[];
//     total: number;
//     page: number;
//     pageSize: number;
//   }> {
//     const { data } = await axios.get("/market/prices", { params: filters });
//     return data;
//   },

//   async getMarketSummary(): Promise<MarketSummary> {
//     const { data } = await axios.get("/market/summary");
//     return data;
//   },

//   async getBestMarket(cropId: string, region?: string): Promise<BestMarket[]> {
//     const { data } = await axios.get("/market/best", { params: { cropId, region } });
//     return data;
//   },

//   async getMarketAlerts(): Promise<MarketAlert[]> {
//     const { data } = await axios.get("/market/alerts");
//     return data;
//   },

//   async markAlertRead(alertId: string): Promise<void> {
//     await axios.patch(`/market/alerts/${alertId}/read`);
//   },

//   async getMarketLocations(region?: string): Promise<MarketLocation[]> {
//     const { data } = await axios.get("/market/locations", { params: { region } });
//     return data;
//   },
// };



import { apiClient as axios } from "@/lib/api/axios";
import type { MarketPrice, MarketSummary, BestMarket, MarketAlert, MarketFilters, MarketLocation } from "../types/market.types";
import {
  mockMarketPrices,
  mockMarketSummary,
  mockBestMarkets,
  mockMarketAlerts,
  mockMarketLocations,
} from "../mocks/market.mock";

// Flip to false once the backend is ready (or set NEXT_PUBLIC_USE_MOCK_MARKET=false in .env)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_MARKET !== "false";

export const marketService = {
  async getMarketPrices(filters?: Partial<MarketFilters>): Promise<{
    data: MarketPrice[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    if (USE_MOCK) {
      return {
        data: mockMarketPrices,
        total: mockMarketPrices.length,
        page: filters?.page ?? 1,
        pageSize: filters?.pageSize ?? 10,
      };
    }
    const { data } = await axios.get("/market/prices", { params: filters });
    return data;
  },

  async getMarketSummary(): Promise<MarketSummary> {
    if (USE_MOCK) return mockMarketSummary;
    const { data } = await axios.get("/market/summary");
    return data;
  },

  async getBestMarket(cropId: string, region?: string): Promise<BestMarket[]> {
    if (USE_MOCK) return mockBestMarkets.map((b) => ({ ...b, cropId }));
    const { data } = await axios.get("/market/best", { params: { cropId, region } });
    return data;
  },

  async getMarketAlerts(): Promise<MarketAlert[]> {
    if (USE_MOCK) return mockMarketAlerts;
    const { data } = await axios.get("/market/alerts");
    return data;
  },

  async markAlertRead(alertId: string): Promise<void> {
    if (USE_MOCK) return;
    await axios.patch(`/market/alerts/${alertId}/read`);
  },

  async getMarketLocations(region?: string): Promise<MarketLocation[]> {
    if (USE_MOCK) {
      return region ? mockMarketLocations.filter((l) => l.state === region) : mockMarketLocations;
    }
    const { data } = await axios.get("/market/locations", { params: { region } });
    return data;
  },
};