import axios, { AxiosInstance } from 'axios';
import {
  AiRecommendationRequest,
  AiRecommendationResponse,
} from '../../modules/crop-recommendation/types/recommendation.types';
import { ICropRecommendation } from '../../modules/crop-recommendation/recommendation.model';

// ─── Mock data factory ────────────────────────────────────────────────────────

/**
 * Returns a realistic set of mocked crop recommendations.
 * Varies suggestions slightly based on season so responses feel contextual.
 */
function buildMockRecommendations(
  payload: AiRecommendationRequest
): ICropRecommendation[] {
  const seasonCrops: Record<string, ICropRecommendation[]> = {
    kharif: [
      {
        rank: 1,
        cropName: 'Cotton',
        variety: 'Bt Cotton H-6',
        confidenceScore: 92,
        expectedYield: '25 quintal/acre',
        expectedProfit: '₹80,000',
        riskLevel: 'low',
        reasoning: `${payload.soilType} soil with ${payload.waterSource} irrigation is highly suitable for cotton. Vidarbha region conditions match well.`,
      },
      {
        rank: 2,
        cropName: 'Soybean',
        variety: 'JS 335',
        confidenceScore: 86,
        expectedYield: '18 quintal/acre',
        expectedProfit: '₹62,000',
        riskLevel: 'medium',
        reasoning: `Moderate profitability with lower water requirements. ${payload.soilType} soil provides adequate nutrients.`,
      },
      {
        rank: 3,
        cropName: 'Pigeon Pea (Tur)',
        variety: 'ICPL 87119',
        confidenceScore: 78,
        expectedYield: '10 quintal/acre',
        expectedProfit: '₹45,000',
        riskLevel: 'low',
        reasoning: 'Drought-tolerant legume that improves soil nitrogen. Good fit for rainfed areas.',
      },
    ],
    rabi: [
      {
        rank: 1,
        cropName: 'Wheat',
        variety: 'GW 322',
        confidenceScore: 90,
        expectedYield: '22 quintal/acre',
        expectedProfit: '₹70,000',
        riskLevel: 'low',
        reasoning: `Cool season crop well-suited to ${payload.state}. ${payload.waterSource} water source is adequate for wheat.`,
      },
      {
        rank: 2,
        cropName: 'Chickpea (Chana)',
        variety: 'JG 11',
        confidenceScore: 84,
        expectedYield: '12 quintal/acre',
        expectedProfit: '₹55,000',
        riskLevel: 'low',
        reasoning: `Low water demand makes it ideal for ${payload.waterSource} conditions. High market demand.`,
      },
      {
        rank: 3,
        cropName: 'Mustard',
        variety: 'Pusa Bold',
        confidenceScore: 76,
        expectedYield: '8 quintal/acre',
        expectedProfit: '₹38,000',
        riskLevel: 'medium',
        reasoning: 'Short duration oilseed crop. Good intercrop option with wheat.',
      },
    ],
    zaid: [
      {
        rank: 1,
        cropName: 'Watermelon',
        variety: 'Sugar Baby',
        confidenceScore: 88,
        expectedYield: '120 quintal/acre',
        expectedProfit: '₹90,000',
        riskLevel: 'medium',
        reasoning: 'High-value summer crop. Requires adequate irrigation but returns are strong.',
      },
      {
        rank: 2,
        cropName: 'Moong (Green Gram)',
        variety: 'PDM 139',
        confidenceScore: 82,
        expectedYield: '6 quintal/acre',
        expectedProfit: '₹35,000',
        riskLevel: 'low',
        reasoning: 'Short duration (60–65 days). Excellent soil fertility improvement crop.',
      },
      {
        rank: 3,
        cropName: 'Cucumber',
        variety: 'Poinsette',
        confidenceScore: 74,
        expectedYield: '80 quintal/acre',
        expectedProfit: '₹48,000',
        riskLevel: 'medium',
        reasoning: 'Growing demand for cucurbit vegetables in local markets during summer.',
      },
    ],
  };

  return seasonCrops[payload.season] ?? seasonCrops['kharif'];
}

// ─── AI Client ────────────────────────────────────────────────────────────────

/**
 * AiClient is the single integration point between the Node.js backend
 * and the external AI service.
 *
 * Current mode: MOCK
 *   Returns hardcoded recommendations. No external HTTP call is made.
 *
 * Future mode: FASTAPI
 *   Set AI_SERVICE_URL in .env and AI_USE_MOCK=false.
 *   The client will POST to `${AI_SERVICE_URL}/crop/recommend` via axios.
 *   No changes needed in Service or Controller layers.
 */
export class AiClient {
  private readonly httpClient: AxiosInstance;
  private readonly useMock: boolean;
  private readonly aiServiceUrl: string;
  private readonly provider: string;

  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://ai-service:8000';
    this.useMock = process.env.AI_USE_MOCK !== 'false'; // default true
    this.provider = this.useMock ? 'mock-v1' : 'fastapi-v1';

    this.httpClient = axios.create({
      baseURL: this.aiServiceUrl,
      timeout: Number(process.env.AI_SERVICE_TIMEOUT_MS ?? 15000),
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.AI_SERVICE_API_KEY
          ? { 'X-Api-Key': process.env.AI_SERVICE_API_KEY }
          : {}),
      },
    });
  }

  /**
   * Generate crop recommendations for the given farm input.
   *
   * - In mock mode: returns instantly with hardcoded data.
   * - In live mode: POSTs to FastAPI `/crop/recommend` endpoint.
   */
  async generateCropRecommendation(
    payload: AiRecommendationRequest
  ): Promise<AiRecommendationResponse> {
    const start = Date.now();

    if (this.useMock) {
      return this.getMockResponse(payload, start);
    }

    return this.callFastApi(payload, start);
  }

  // ─── Mock Mode ────────────────────────────────────────────────────────────

  private getMockResponse(
    payload: AiRecommendationRequest,
    startMs: number
  ): AiRecommendationResponse {
    // Simulate latency so frontend loading states work during development
    const mockDelayMs = 200;

    const recommendations = buildMockRecommendations(payload);

    return {
      recommendations,
      provider: this.provider,
      processingTimeMs: Date.now() - startMs + mockDelayMs,
    };
  }

  // ─── FastAPI Mode ─────────────────────────────────────────────────────────

  /**
   * POST http://ai-service:8000/crop/recommend
   *
   * Expected FastAPI response shape:
   * {
   *   recommendations: CropRecommendation[],
   *   provider: string,
   *   processing_time_ms: number
   * }
   */
  private async callFastApi(
    payload: AiRecommendationRequest,
    startMs: number
  ): Promise<AiRecommendationResponse> {
    const response = await this.httpClient.post<{
      recommendations: ICropRecommendation[];
      provider: string;
      processing_time_ms: number;
    }>('/crop/recommend', payload);

    return {
      recommendations: response.data.recommendations,
      provider: response.data.provider ?? this.provider,
      processingTimeMs: response.data.processing_time_ms ?? (Date.now() - startMs),
    };
  }
}

// Singleton export — avoids creating a new axios instance per request
export const aiClient = new AiClient();
