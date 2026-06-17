import type {
  FarmHealthData,
  FarmHealthScore,
  HealthScoreBreakdown,
  SoilHealth,
  WaterEfficiency,
  DiseaseRisk,
  ImprovementRecommendation,
  HealthTrendPoint,
} from '../types/farm-health.types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockTrend: HealthTrendPoint[] = [
  { month: 'Jan', score: 72, soilScore: 68, waterScore: 75 },
  { month: 'Feb', score: 74, soilScore: 70, waterScore: 76 },
  { month: 'Mar', score: 76, soilScore: 72, waterScore: 78 },
  { month: 'Apr', score: 79, soilScore: 75, waterScore: 80 },
  { month: 'May', score: 81, soilScore: 77, waterScore: 82 },
  { month: 'Jun', score: 84, soilScore: 80, waterScore: 85 },
];

const mockScore: FarmHealthScore = {
  overall: 84,
  trend: 'up',
  trendValue: 3.2,
  riskLevel: 'low',
  improvementPotential: 16,
  lastUpdated: new Date().toISOString(),
};

const mockBreakdown: HealthScoreBreakdown = {
  soilQuality: 80,
  waterEfficiency: 85,
  diseaseRisk: 78,
  marketPotential: 88,
  cropPerformance: 82,
};

const mockSoilHealth: SoilHealth = {
  ph: 6.8,
  phStatus: 'optimal',
  organicMatter: 3.2,
  nitrogen: 72,
  phosphorus: 65,
  potassium: 80,
  soilCondition: 'good',
  recommendations: [
    'Add organic compost to increase organic matter',
    'Maintain current pH levels with lime application',
    'Increase phosphorus with DAP fertilizer',
  ],
};

const mockWaterEfficiency: WaterEfficiency = {
  usagePerAcre: 820,
  irrigationEfficiency: 78,
  rainDependency: 45,
  waterRisk: 'low',
  monthlySavingPotential: 120,
  recommendations: [
    'Switch to drip irrigation for 20% water savings',
    'Install soil moisture sensors',
    'Schedule irrigation during cooler hours',
  ],
};

const mockDiseaseRisk: DiseaseRisk = {
  currentRisk: 'low',
  riskScore: 22,
  nearbyOutbreaks: [
    {
      disease: 'Leaf Blight',
      distanceKm: 12,
      severity: 'medium',
      affectedCrop: 'Wheat',
    },
    {
      disease: 'Root Rot',
      distanceKm: 8,
      severity: 'low',
      affectedCrop: 'Soybean',
    },
  ],
  weatherImpact: 'moderate',
  preventionActions: [
    'Apply preventive fungicide spray',
    'Ensure proper drainage to prevent root diseases',
    'Monitor crops weekly for early symptoms',
  ],
};

const mockRecommendations: ImprovementRecommendation[] = [
  {
    id: '1',
    title: 'Switch to Drip Irrigation',
    description: 'Replace flood irrigation with drip system for major water savings',
    expectedImpact: 20,
    difficulty: 'medium',
    estimatedBenefit: 15000,
    category: 'water',
    timeToImplement: '2-3 weeks',
  },
  {
    id: '2',
    title: 'Soil Microbiome Enhancement',
    description: 'Apply biofertilizers to boost soil health and crop yield',
    expectedImpact: 15,
    difficulty: 'easy',
    estimatedBenefit: 8000,
    category: 'soil',
    timeToImplement: '1 week',
  },
  {
    id: '3',
    title: 'Integrated Pest Management',
    description: 'Adopt IPM practices to reduce chemical usage and disease risk',
    expectedImpact: 12,
    difficulty: 'medium',
    estimatedBenefit: 6000,
    category: 'disease',
    timeToImplement: '3-4 weeks',
  },
  {
    id: '4',
    title: 'Crop Rotation Planning',
    description: 'Implement a 3-year crop rotation to improve soil health',
    expectedImpact: 18,
    difficulty: 'easy',
    estimatedBenefit: 12000,
    category: 'crop',
    timeToImplement: 'Next season',
  },
];

export const mockFarmHealthData: FarmHealthData = {
  score: mockScore,
  breakdown: mockBreakdown,
  soilHealth: mockSoilHealth,
  waterEfficiency: mockWaterEfficiency,
  diseaseRisk: mockDiseaseRisk,
  recommendations: mockRecommendations,
  trend: mockTrend,
};

// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchFarmHealth(farmerId: string): Promise<FarmHealthData> {
  // Replace with real API call: GET /api/farm-health/:farmerId
  await new Promise((r) => setTimeout(r, 800));
  return mockFarmHealthData;
}

export async function fetchHealthScore(farmerId: string): Promise<FarmHealthScore> {
  await new Promise((r) => setTimeout(r, 400));
  return mockFarmHealthData.score;
}

export async function refreshHealthAnalysis(farmerId: string): Promise<FarmHealthData> {
  await new Promise((r) => setTimeout(r, 1200));
  return mockFarmHealthData;
}
