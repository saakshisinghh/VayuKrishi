import axios, { AxiosInstance, AxiosError } from 'axios';
import { AiDetectRequest, AiDetectResponse } from '../../modules/disease-detection/types/disease.types';
import { Severity, AiProvider } from '../../modules/disease-detection/disease.model';

// ─── Environment config ───────────────────────────────────────────────────────

const AI_SERVICE_URL  = process.env.AI_SERVICE_URL  || 'http://ai-service:8000';
const AI_SERVICE_KEY  = process.env.AI_SERVICE_KEY  || '';
const USE_MOCK_AI     = process.env.USE_MOCK_AI     !== 'false'; // default: true (mock)
const AI_TIMEOUT_MS   = Number(process.env.AI_TIMEOUT_MS) || 30_000;

// ─── Axios Instance ───────────────────────────────────────────────────────────

const aiAxios: AxiosInstance = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: AI_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    ...(AI_SERVICE_KEY ? { 'X-API-Key': AI_SERVICE_KEY } : {}),
  },
});

// ─── Mock Response ────────────────────────────────────────────────────────────

function buildMockResponse(request: AiDetectRequest): AiDetectResponse {
  // Simulate realistic processing latency variance in mock
  const mockStart = Date.now();

  return {
    diseaseName: 'Leaf Blight',
    confidence: 94,
    severity: Severity.MODERATE,
    affectedArea: 35,
    cause: 'Fungal infection caused by Alternaria alternata',
    treatmentPlan: [
      {
        step: 1,
        action: 'Remove and destroy infected plant parts',
        product: 'Manual removal',
        quantity: 'All visibly infected leaves',
      },
      {
        step: 2,
        action: 'Apply fungicide spray',
        product: 'Mancozeb 75% WP',
        quantity: '2g per litre of water',
      },
      {
        step: 3,
        action: 'Follow-up spray after 10 days',
        product: 'Carbendazim 50% WP',
        quantity: '1g per litre of water',
      },
    ],
    preventiveMeasures: [
      'Avoid overhead irrigation and waterlogging',
      'Ensure adequate spacing between plants for air circulation',
      'Use certified disease-free seeds',
      'Rotate crops every season',
      'Apply balanced fertiliser — avoid excess nitrogen',
    ],
    processingTime: Date.now() - mockStart,
    provider: AiProvider.MOCK,
  };
}

// ─── FastAPI Call ─────────────────────────────────────────────────────────────

async function callFastApiService(request: AiDetectRequest): Promise<AiDetectResponse> {
  const start = Date.now();

  try {
    const response = await aiAxios.post<AiDetectResponse>('/disease/detect', {
      crop_name:  request.cropName,
      image_url:  request.imageUrl,
      media_id:   request.mediaId,
    });

    const data = response.data;
    data.processingTime = Date.now() - start;
    data.provider       = AiProvider.FASTAPI;
    return data;

  } catch (err) {
    const axiosErr = err as AxiosError;
    const status   = axiosErr.response?.status ?? 0;
    const detail   = (axiosErr.response?.data as Record<string, unknown>)?.detail ?? axiosErr.message;

    throw new Error(
      `AI service error [HTTP ${status}]: ${detail}`,
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * detectDisease
 *
 * Entry-point for disease analysis.
 * When USE_MOCK_AI=true  → returns deterministic mock (no network call)
 * When USE_MOCK_AI=false → calls FastAPI service at AI_SERVICE_URL
 *
 * To integrate the real model later:
 *   1. Set USE_MOCK_AI=false in .env
 *   2. Set AI_SERVICE_URL=http://ai-service:8000
 *   3. Deploy FastAPI service that accepts POST /disease/detect
 */
export async function detectDisease(request: AiDetectRequest): Promise<AiDetectResponse> {
  if (USE_MOCK_AI) {
    return buildMockResponse(request);
  }
  return callFastApiService(request);
}

export default { detectDisease };
