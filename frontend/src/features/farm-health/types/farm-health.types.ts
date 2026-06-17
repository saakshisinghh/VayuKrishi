export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'up' | 'down' | 'stable';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface FarmHealthScore {
  overall: number;
  trend: TrendDirection;
  trendValue: number;
  riskLevel: RiskLevel;
  improvementPotential: number;
  lastUpdated: string;
}

export interface HealthScoreBreakdown {
  soilQuality: number;
  waterEfficiency: number;
  diseaseRisk: number;
  marketPotential: number;
  cropPerformance: number;
}

export interface SoilHealth {
  ph: number;
  phStatus: 'optimal' | 'low' | 'high';
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilCondition: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

export interface WaterEfficiency {
  usagePerAcre: number;
  irrigationEfficiency: number;
  rainDependency: number;
  waterRisk: RiskLevel;
  monthlySavingPotential: number;
  recommendations: string[];
}

export interface DiseaseRisk {
  currentRisk: RiskLevel;
  riskScore: number;
  nearbyOutbreaks: NearbyOutbreak[];
  weatherImpact: 'low' | 'moderate' | 'high';
  preventionActions: string[];
}

export interface NearbyOutbreak {
  disease: string;
  distanceKm: number;
  severity: RiskLevel;
  affectedCrop: string;
}

export interface ImprovementRecommendation {
  id: string;
  title: string;
  description: string;
  expectedImpact: number;
  difficulty: DifficultyLevel;
  estimatedBenefit: number;
  category: 'soil' | 'water' | 'disease' | 'market' | 'crop';
  timeToImplement: string;
}

export interface HealthTrendPoint {
  month: string;
  score: number;
  soilScore: number;
  waterScore: number;
}

export interface FarmHealthData {
  score: FarmHealthScore;
  breakdown: HealthScoreBreakdown;
  soilHealth: SoilHealth;
  waterEfficiency: WaterEfficiency;
  diseaseRisk: DiseaseRisk;
  recommendations: ImprovementRecommendation[];
  trend: HealthTrendPoint[];
}
