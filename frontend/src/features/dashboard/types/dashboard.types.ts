export interface FarmSnapshot {
  activeCrop: string;
  activeCropStage: string;
  projectedProfit: number;
  projectedProfitTrend: number; // percentage change
  farmHealthScore: number;
  farmHealthTrend: number;
  diseaseRisk: "low" | "moderate" | "high" | "critical";
  diseaseRiskScore: number;
  lastUpdated: string;
}

export interface AIRecommendation {
  id: string;
  recommendedCrop: string;
  expectedProfit: number;
  riskScore: number; // 0-100, lower is better
  confidenceScore: number; // 0-100
  reasoning: string;
  keyFactors: string[];
  season: string;
  soilCompatibility: number;
  marketDemand: "low" | "medium" | "high";
}

export interface DiseaseAlert {
  id: string;
  diseaseName: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  affectedCrop: string;
  affectedAreaKm: number;
  distanceFromFarm: number;
  recommendedAction: string;
  reportedDate: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  matchScore: number;
  potentialBenefit: number;
  benefitType: "cash" | "subsidy" | "loan" | "insurance";
  deadline: string | null;
  isEligible: boolean;
}

export interface DashboardOverview {
  farmSnapshot: FarmSnapshot;
  aiRecommendations: AIRecommendation[];
  diseaseAlerts: DiseaseAlert[];
  schemes: GovernmentScheme[];
}
