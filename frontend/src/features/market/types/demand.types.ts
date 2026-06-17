export interface DemandInsight {
  cropId: string;
  crop: string;
  demandScore: number;
  demandTrend: "rising" | "falling" | "stable";
  demandChangePercent: number;
  category: "high" | "emerging" | "declining" | "stable";
  topRegions: RegionDemand[];
  weeklyTrend: DemandPoint[];
  monthlyTrend: DemandPoint[];
  drivers: string[];
}

export interface RegionDemand {
  region: string;
  state: string;
  demandScore: number;
  avgPrice: number;
  volume: number;
}

export interface DemandPoint {
  date: string;
  score: number;
  volume: number;
}

export interface DemandSummary {
  highDemandCrops: DemandInsight[];
  emergingCrops: DemandInsight[];
  decliningCrops: DemandInsight[];
  regionalHotspots: RegionDemand[];
  overallMarketDemandIndex: number;
}
