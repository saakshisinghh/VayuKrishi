// ─── Crop Recommendation Types ───────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high';
export type Season = 'kharif' | 'rabi' | 'zaid';
export type OwnershipType = 'owned' | 'leased' | 'shared';
export type IrrigationSource = 'canal' | 'borewell' | 'rainwater' | 'river' | 'tank' | 'drip';
export type SoilType = 'black' | 'red' | 'alluvial' | 'sandy' | 'loamy' | 'clay' | 'laterite';
export type LandUnit = 'acres' | 'hectares' | 'bigha' | 'guntha';
export type WaterAvailability = 'abundant' | 'moderate' | 'scarce';

export interface FarmLocation {
  state: string;
  district: string;
  village: string;
  pincode: string;
}

export interface LandDetails {
  size: number;
  unit: LandUnit;
  ownershipType: OwnershipType;
}

export interface SoilInformation {
  soilType: SoilType;
  phValue: number;
  organicMatter: 'low' | 'medium' | 'high';
}

export interface WaterInfo {
  irrigationSource: IrrigationSource;
  waterAvailability: WaterAvailability;
  rainDependency: boolean;
}

export interface SeasonPreference {
  kharif: boolean;
  rabi: boolean;
  zaid: boolean;
}

export interface FarmingGoals {
  maximumProfit: boolean;
  lowRisk: boolean;
  waterSaving: boolean;
  organicFarming: boolean;
}

export interface FarmProfile {
  location: FarmLocation;
  landDetails: LandDetails;
  soilInformation: SoilInformation;
  waterInfo: WaterInfo;
  seasonPreference: SeasonPreference;
  goals: FarmingGoals;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  cropNameLocal: string;
  rank: number;
  season: Season;
  expectedYield: number;        // kg per acre
  expectedRevenue: number;      // INR
  expectedProfit: number;       // INR
  inputCost: number;            // INR
  confidence: number;           // 0–100
  riskLevel: RiskLevel;
  imageUrl?: string;
  reasons: RecommendationReason[];
  marketTrend: 'up' | 'down' | 'stable';
  demandScore: number;          // 0–100
}

export interface RecommendationReason {
  id: string;
  category: 'soil' | 'weather' | 'market' | 'regional' | 'water' | 'goal';
  description: string;
  weight: number;               // contribution % to recommendation
}

export interface RecommendationResponse {
  recommendations: CropRecommendation[];
  generatedAt: string;
  accuracy: number;
  modelVersion: string;
  farmProfile: FarmProfile;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  farmProfile: Partial<FarmProfile>;
}

export type ProcessingStage =
  | 'analyzing_soil'
  | 'checking_weather'
  | 'analyzing_market'
  | 'calculating_risks'
  | 'generating_recommendations';
