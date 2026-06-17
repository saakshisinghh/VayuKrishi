// import { apiClient as axios } from "@/lib/api/axios";
// import type { DemandInsight, DemandSummary } from "../types/demand.types";

// export const demandService = {
//   async getDemandInsights(cropId?: string): Promise<DemandInsight[]> {
//     const { data } = await axios.get("/market/demand", { params: { cropId } });
//     return data;
//   },

//   async getDemandSummary(): Promise<DemandSummary> {
//     const { data } = await axios.get("/market/demand/summary");
//     return data;
//   },

//   async getRegionalDemand(region: string): Promise<DemandInsight[]> {
//     const { data } = await axios.get("/market/demand/regional", { params: { region } });
//     return data;
//   },
// };


import { apiClient as axios } from "@/lib/api/axios";
import type { DemandInsight, DemandSummary } from "../types/demand.types";
import { mockGetDemandInsights, mockGetDemandSummary } from "../mocks/market.mock";

// Flip to false once the backend is ready (or set NEXT_PUBLIC_USE_MOCK_MARKET=false in .env)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_MARKET !== "false";

export const demandService = {
  async getDemandInsights(cropId?: string): Promise<DemandInsight[]> {
    if (USE_MOCK) return mockGetDemandInsights(cropId);
    const { data } = await axios.get("/market/demand", { params: { cropId } });
    return data;
  },

  async getDemandSummary(): Promise<DemandSummary> {
    if (USE_MOCK) return mockGetDemandSummary();
    const { data } = await axios.get("/market/demand/summary");
    return data;
  },

  async getRegionalDemand(region: string): Promise<DemandInsight[]> {
    if (USE_MOCK) return mockGetDemandInsights().filter((d) => d.topRegions.some((r) => r.state === region));
    const { data } = await axios.get("/market/demand/regional", { params: { region } });
    return data;
  },
};

