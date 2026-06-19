import type { FarmProfile } from '../types/crop-recommendation.types';
import type {
  CropRecommendation,
  RecommendationResponse,
} from '../types/crop-recommendation.types';
import type { ProfitSimulationResponse } from '../types/profit.types';
import type { FarmPlanResponse } from '../types/farm-plan.types';

// ─── API Base ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

// ─── Mock Data (until backend is live) ───────────────────────────────────────
const MOCK_RECOMMENDATIONS: CropRecommendation[] = [
  {
    id: 'soybean',
    cropName: 'Soybean',
    cropNameLocal: 'सोयाबीन',
    rank: 1,
    season: 'kharif',
    expectedYield: 1200,
    expectedRevenue: 125000,
    expectedProfit: 85000,
    inputCost: 40000,
    confidence: 92,
    riskLevel: 'medium',
    marketTrend: 'up',
    demandScore: 87,
    reasons: [
      {
        id: 'r1',
        category: 'soil',
        description: 'Black soil is highly suitable for soybean cultivation.',
        weight: 32,
      },
      {
        id: 'r2',
        category: 'weather',
        description: 'Current weather conditions are favorable.',
        weight: 28,
      },
      {
        id: 'r3',
        category: 'market',
        description: 'Current market demand is increasing steadily.',
        weight: 25,
      },
      {
        id: 'r4',
        category: 'regional',
        description: 'Regional success rate is high (88%) for this crop.',
        weight: 15,
      },
    ],
  },
  {
    id: 'cotton',
    cropName: 'Cotton',
    cropNameLocal: 'कपास',
    rank: 2,
    season: 'kharif',
    expectedYield: 800,
    expectedRevenue: 140000,
    expectedProfit: 85000,
    inputCost: 55000,
    confidence: 85,
    riskLevel: 'high',
    marketTrend: 'stable',
    demandScore: 79,
    reasons: [
      {
        id: 'r5',
        category: 'soil',
        description: 'Deep black soil suits cotton root systems well.',
        weight: 35,
      },
      {
        id: 'r6',
        category: 'market',
        description: 'Textile demand sustaining strong cotton prices.',
        weight: 30,
      },
      {
        id: 'r7',
        category: 'weather',
        description: 'Long dry spell forecast is ideal for boll development.',
        weight: 20,
      },
      {
        id: 'r8',
        category: 'regional',
        description: 'Vidarbha region has strong cotton cultivation history.',
        weight: 15,
      },
    ],
  },
  {
    id: 'tur-dal',
    cropName: 'Tur Dal',
    cropNameLocal: 'तूर दाल',
    rank: 3,
    season: 'kharif',
    expectedYield: 900,
    expectedRevenue: 95000,
    expectedProfit: 62000,
    inputCost: 33000,
    confidence: 78,
    riskLevel: 'low',
    marketTrend: 'up',
    demandScore: 91,
    reasons: [
      {
        id: 'r9',
        category: 'goal',
        description: 'Matches your low-risk goal with stable government MSP.',
        weight: 38,
      },
      {
        id: 'r10',
        category: 'soil',
        description: 'Moderately deep soils are adequate for pigeon pea.',
        weight: 22,
      },
      {
        id: 'r11',
        category: 'market',
        description: 'Pulses demand at all-time high due to protein awareness.',
        weight: 25,
      },
      {
        id: 'r12',
        category: 'water',
        description: 'Drought-tolerant crop suits moderate irrigation availability.',
        weight: 15,
      },
    ],
  },
];

// ─── Crop Recommendation Service ─────────────────────────────────────────────
export const cropRecommendationService = {
  async getRecommendations(
    farmProfile: FarmProfile,
    useMock = true
  ): Promise<RecommendationResponse> {
    if (useMock) {
      // Simulate API latency
      await new Promise((r) => setTimeout(r, 4500));
      return {
        recommendations: MOCK_RECOMMENDATIONS,
        generatedAt: new Date().toISOString(),
        accuracy: 94,
        modelVersion: 'vayukrishi-agri-v2.1',
        farmProfile,
      };
    }

    const res = await fetch(`${API_BASE}/crop-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmProfile }),
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getProfitSimulation(
    cropIds: string[],
    landSize: number,
    landUnit: string,
    useMock = true
  ): Promise<ProfitSimulationResponse> {
    if (useMock) {
      await new Promise((r) => setTimeout(r, 1200));
      return {
        crops: MOCK_RECOMMENDATIONS.map((c) => ({
          cropId: c.id,
          cropName: c.cropName,
          inputCost: c.inputCost,
          revenue: c.expectedRevenue,
          profit: c.expectedProfit,
          roi: Math.round((c.expectedProfit / c.inputCost) * 100),
          riskLevel: c.riskLevel,
          breakEvenYield: Math.round(c.expectedYield * 0.55),
          netProfitMargin: Math.round((c.expectedProfit / c.expectedRevenue) * 100),
        })),
        bestCrop: 'soybean',
        simulatedAt: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE}/profit-simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropIds, landSize, landUnit }),
    });
    if (!res.ok) throw new Error('Failed to fetch profit simulation');
    return res.json();
  },

  async getFarmPlan(
    cropId: string,
    farmProfile: FarmProfile,
    useMock = true
  ): Promise<FarmPlanResponse> {
    if (useMock) {
      await new Promise((r) => setTimeout(r, 1500));
      const crop = MOCK_RECOMMENDATIONS.find((c) => c.id === cropId);
      return {
        cropId,
        cropName: crop?.cropName ?? 'Soybean',
        season: 'kharif',
        startMonth: 6,
        durationMonths: 5,
        totalEstimatedCost: crop?.inputCost ?? 40000,
        generatedAt: new Date().toISOString(),
        monthlyPlans: [
          {
            month: 6,
            monthName: 'June',
            cropStage: 'Land Preparation',
            activities: [
              {
                id: 'a1',
                title: 'Deep Ploughing',
                description: 'Plough 20–25 cm deep to loosen compacted soil layers.',
                category: 'activity',
                priority: 'critical',
                durationDays: 3,
                cost: 3500,
              },
              {
                id: 'a2',
                title: 'Seed Treatment',
                description: 'Treat seeds with Rhizobium culture for nitrogen fixation.',
                category: 'activity',
                priority: 'high',
                durationDays: 1,
                cost: 800,
              },
            ],
            fertilizerTasks: [
              {
                id: 'f1',
                title: 'Basal Dose — DAP',
                description: 'Apply 18:46:0 DAP @ 50 kg/acre as basal fertilizer.',
                category: 'fertilizer',
                priority: 'critical',
                cost: 1800,
              },
            ],
            irrigationTasks: [
              {
                id: 'i1',
                title: 'Pre-sowing Irrigation',
                description: 'Light irrigation to bring soil to field capacity.',
                category: 'irrigation',
                priority: 'high',
              },
            ],
            monitoringTasks: [
              {
                id: 'm1',
                title: 'Soil Moisture Check',
                description: 'Verify soil moisture is adequate before sowing.',
                category: 'monitoring',
                priority: 'medium',
              },
            ],
            estimatedCost: 6100,
            weatherNote: 'Watch for pre-monsoon showers. Delay sowing if heavy rain forecast.',
          },
          {
            month: 7,
            monthName: 'July',
            cropStage: 'Germination & Emergence',
            activities: [
              {
                id: 'a3',
                title: 'Sowing',
                description: 'Sow seeds at 45×10 cm spacing, 3–4 cm depth.',
                category: 'activity',
                priority: 'critical',
                durationDays: 2,
                cost: 2000,
              },
              {
                id: 'a4',
                title: 'Gap Filling',
                description: 'Fill gaps in stand within 10 days of emergence.',
                category: 'activity',
                priority: 'high',
                durationDays: 1,
              },
            ],
            fertilizerTasks: [],
            irrigationTasks: [
              {
                id: 'i2',
                title: 'Post-sowing Irrigation',
                description: 'Light sprinkler irrigation if monsoon delayed > 5 days.',
                category: 'irrigation',
                priority: 'medium',
              },
            ],
            monitoringTasks: [
              {
                id: 'm2',
                title: 'Pest Scouting',
                description: 'Scout for stem fly and white fly from day 10.',
                category: 'monitoring',
                priority: 'high',
              },
            ],
            estimatedCost: 2000,
          },
          {
            month: 8,
            monthName: 'August',
            cropStage: 'Vegetative Growth',
            activities: [
              {
                id: 'a5',
                title: 'Inter-cultivation (Weeding)',
                description: 'First weeding at 20–25 DAS with rotary weeder.',
                category: 'activity',
                priority: 'high',
                durationDays: 2,
                cost: 2500,
              },
            ],
            fertilizerTasks: [
              {
                id: 'f2',
                title: 'Foliar Spray — Micronutrients',
                description: 'Spray 0.5% ZnSO4 to address zinc deficiency.',
                category: 'fertilizer',
                priority: 'medium',
                cost: 600,
              },
            ],
            irrigationTasks: [
              {
                id: 'i3',
                title: 'Supplemental Irrigation',
                description: 'Irrigate if dry spell > 15 days during vegetative stage.',
                category: 'irrigation',
                priority: 'medium',
              },
            ],
            monitoringTasks: [
              {
                id: 'm3',
                title: 'Yellow Mosaic Virus Watch',
                description: 'Monitor for YMV symptoms; remove infected plants immediately.',
                category: 'monitoring',
                priority: 'critical',
              },
            ],
            estimatedCost: 3100,
          },
          {
            month: 9,
            monthName: 'September',
            cropStage: 'Flowering & Pod Formation',
            activities: [
              {
                id: 'a6',
                title: 'Second Weeding',
                description: 'Final hand weeding before canopy closure.',
                category: 'activity',
                priority: 'medium',
                durationDays: 1,
                cost: 1500,
              },
            ],
            fertilizerTasks: [
              {
                id: 'f3',
                title: 'Potassium Foliar Spray',
                description: 'Apply 1% K2SO4 at flowering for pod setting.',
                category: 'fertilizer',
                priority: 'high',
                cost: 400,
              },
            ],
            irrigationTasks: [
              {
                id: 'i4',
                title: 'Critical Irrigation — Flowering',
                description: 'Ensure adequate moisture during flowering. Critical stage.',
                category: 'irrigation',
                priority: 'critical',
              },
            ],
            monitoringTasks: [
              {
                id: 'm4',
                title: 'Pod Borer Monitoring',
                description: 'Install pheromone traps; spray if > 5 moths/trap/week.',
                category: 'monitoring',
                priority: 'high',
              },
            ],
            estimatedCost: 1900,
          },
          {
            month: 10,
            monthName: 'October',
            cropStage: 'Maturity & Harvest',
            activities: [
              {
                id: 'a7',
                title: 'Harvesting',
                description: 'Harvest when 95% pods turn yellow-brown. Use combine.',
                category: 'activity',
                priority: 'critical',
                durationDays: 3,
                cost: 8000,
              },
              {
                id: 'a8',
                title: 'Threshing & Drying',
                description: 'Sun-dry to 12% moisture before storage.',
                category: 'activity',
                priority: 'high',
                durationDays: 3,
                cost: 2500,
              },
            ],
            fertilizerTasks: [],
            irrigationTasks: [],
            monitoringTasks: [
              {
                id: 'm5',
                title: 'Moisture Testing',
                description: 'Test grain moisture before bagging. Target: < 12%.',
                category: 'monitoring',
                priority: 'high',
              },
            ],
            estimatedCost: 10500,
          },
        ],
      };
    }

    const res = await fetch(`${API_BASE}/farm-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropId, farmProfile }),
    });
    if (!res.ok) throw new Error('Failed to fetch farm plan');
    return res.json();
  },
};
