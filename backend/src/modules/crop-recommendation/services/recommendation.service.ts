import { Types } from 'mongoose';
import { IRecommendation } from '../recommendation.model';
import {
  IRecommendationService,
  IRecommendationRepository,
  CreateRecommendationDto,
  RecommendationHistoryQuery,
  PaginatedRecommendations,
  AiRecommendationRequest,
} from '../types/recommendation.types';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { aiClient } from '../../../integrations/ai/ai-client';
import { AppError } from '../../../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpStatus';

// Minimal Farm shape we need — avoids importing Phase 3 model directly
interface FarmSnapshot {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  soilType: string;
  totalArea: number;
  waterSource: string;
  location: {
    village: string;
    district: string;
    state: string;
    country: string;
  };
  isActive: boolean;
}

export class RecommendationService implements IRecommendationService {
  private readonly repo: IRecommendationRepository;

  constructor(repo?: IRecommendationRepository) {
    this.repo = repo ?? new RecommendationRepository();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private assertOwnerOrAdmin(
    rec: IRecommendation,
    requesterId: string,
    requesterRole: string
  ): void {
    const isOwner = rec.userId.toString() === requesterId;
    const isAdmin = requesterRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You are not authorized to access this recommendation',
        HTTP_STATUS.FORBIDDEN
      );
    }
  }

  private async findActiveOrFail(id: string): Promise<IRecommendation> {
    const rec = await this.repo.findById(id);

    if (!rec) {
      throw new AppError('Recommendation not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!rec.isActive) {
      throw new AppError(
        'Recommendation has been deleted',
        HTTP_STATUS.GONE
      );
    }

    return rec;
  }

  /**
   * Load the farm from MongoDB without importing Phase 3 model.
   * Using mongoose model registry (works because Farm is registered at startup).
   */
  private async loadFarm(farmId: string, userId: string): Promise<FarmSnapshot> {
    const mongoose = await import('mongoose');
    // Farm model is registered in Phase 3 startup; access via registry
    const FarmModel = mongoose.model<FarmSnapshot>('Farm');

    const farm = await FarmModel.findById(farmId).lean<FarmSnapshot>();

    if (!farm) {
      throw new AppError('Farm not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!farm.isActive) {
      throw new AppError('Farm is deactivated', HTTP_STATUS.BAD_REQUEST);
    }

    // Ownership check — admin bypass
    if (farm.userId.toString() !== userId) {
      throw new AppError(
        'You do not own this farm',
        HTTP_STATUS.FORBIDDEN
      );
    }

    return farm;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Main workflow:
   * 1. Validate farm ownership
   * 2. Build AI request payload from farm data
   * 3. Call AI client (mock or FastAPI)
   * 4. Persist recommendation record
   * 5. Return persisted document
   */
  async createRecommendation(
    userId: string,
    { farmId, season }: CreateRecommendationDto
  ): Promise<IRecommendation> {
    // Step 1 — verify farm
    const farm = await this.loadFarm(farmId, userId);

    // Step 2 — build AI payload
    const aiPayload: AiRecommendationRequest = {
      soilType:    farm.soilType,
      totalArea:   farm.totalArea,
      waterSource: farm.waterSource,
      season,
      village:  farm.location?.village  ?? '',
      district: farm.location?.district ?? '',
      state:    farm.location?.state    ?? '',
      country:  farm.location?.country  ?? 'India',
    };

    // Step 3 — call AI service
    let aiResponse;
    let status: 'completed' | 'failed' = 'completed';

    try {
      aiResponse = await aiClient.generateCropRecommendation(aiPayload);
    } catch (err) {
      // Don't blow up the request; save with failed status for retry/debug
      status = 'failed';
      aiResponse = {
        recommendations: [],
        provider: 'unknown',
        processingTimeMs: 0,
      };
    }

    // Step 4 — persist
    const record = await this.repo.create({
      userId:   new Types.ObjectId(userId),
      farmId:   new Types.ObjectId(farmId),
      season,
      year:     new Date().getFullYear(),
      inputData: {
        soilType:    farm.soilType as any,
        totalArea:   farm.totalArea,
        waterSource: farm.waterSource as any,
        season,
        location: {
          village:  farm.location?.village  ?? '',
          district: farm.location?.district ?? '',
          state:    farm.location?.state    ?? '',
          country:  farm.location?.country  ?? 'India',
        },
      },
      recommendations: aiResponse.recommendations,
      aiProvider:      aiResponse.provider,
      processingTime:  aiResponse.processingTimeMs,
      status,
    });

    if (status === 'failed') {
      throw new AppError(
        'AI service is temporarily unavailable. Request saved with failed status.',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }

    return record;
  }

  async getHistory(
    userId: string,
    query: RecommendationHistoryQuery
  ): Promise<PaginatedRecommendations> {
    return this.repo.findHistory(new Types.ObjectId(userId), query);
  }

  async getRecommendationById(
    id: string,
    requesterId: string,
    requesterRole: string
  ): Promise<IRecommendation> {
    const rec = await this.findActiveOrFail(id);
    this.assertOwnerOrAdmin(rec, requesterId, requesterRole);
    return rec;
  }

  async deleteRecommendation(
    id: string,
    requesterId: string,
    requesterRole: string
  ): Promise<void> {
    const rec = await this.findActiveOrFail(id);
    this.assertOwnerOrAdmin(rec, requesterId, requesterRole);
    await this.repo.softDelete(id);
  }
}
