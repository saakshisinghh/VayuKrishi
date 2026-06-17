// import { apiClient as axios } from "@/lib/api/axios";
// import type { PriceForecast, SellDecision, SeasonalTrend } from "../types/forecast.types";
// import type { CropComparisonData } from "../types/comparison.types";

// export const forecastService = {
//   async getForecasts(cropId: string): Promise<PriceForecast> {
//     const { data } = await axios.get(`/market/forecast/${cropId}`);
//     return data;
//   },

//   async getSellRecommendation(cropId: string, quantity?: number): Promise<SellDecision> {
//     const { data } = await axios.get(`/market/sell-recommendation/${cropId}`, {
//       params: { quantity },
//     });
//     return data;
//   },

//   async getSeasonalTrend(cropId: string): Promise<SeasonalTrend> {
//     const { data } = await axios.get(`/market/seasonal/${cropId}`);
//     return data;
//   },

//   async getCropComparison(cropIds: string[]): Promise<CropComparisonData> {
//     const { data } = await axios.post("/market/compare", { cropIds });
//     return data;
//   },
// };




import { apiClient as axios } from "@/lib/api/axios";
import type { PriceForecast, SellDecision, SeasonalTrend } from "../types/forecast.types";
import type { CropComparisonData } from "../types/comparison.types";
import {
  mockGetForecast,
  mockGetSellRecommendation,
  mockGetSeasonalTrend,
  mockGetCropComparison,
} from "../mocks/market.mock";

// Flip to false once the backend is ready (or set NEXT_PUBLIC_USE_MOCK_MARKET=false in .env)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_MARKET !== "false";

export const forecastService = {
  async getForecasts(cropId: string): Promise<PriceForecast> {
    if (USE_MOCK) return mockGetForecast(cropId);
    const { data } = await axios.get(`/market/forecast/${cropId}`);
    return data;
  },

  async getSellRecommendation(cropId: string, quantity?: number): Promise<SellDecision> {
    if (USE_MOCK) return mockGetSellRecommendation(cropId);
    const { data } = await axios.get(`/market/sell-recommendation/${cropId}`, {
      params: { quantity },
    });
    return data;
  },

  async getSeasonalTrend(cropId: string): Promise<SeasonalTrend> {
    if (USE_MOCK) return mockGetSeasonalTrend(cropId);
    const { data } = await axios.get(`/market/seasonal/${cropId}`);
    return data;
  },

  async getCropComparison(cropIds: string[]): Promise<CropComparisonData> {
    if (USE_MOCK) return mockGetCropComparison(cropIds);
    const { data } = await axios.post("/market/compare", { cropIds });
    return data;
  },
};