import { Types } from 'mongoose';
import {
  IRecommendation,
  ICropRecommendation,
  IInputData,
  Season,
  RecommendationStatus,
} from '../recommendation.model';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateRecommendationDto {
  farmId: string;
  season: Season;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface RecommendationHistoryQuery {
  page?: number;
  limit?: number;
  season?: Season;
  year?: number;
  sortOrder?: 'newest' | 'oldest';
}

// ─── AI Client Payload / Response ─────────────────────────────────────────────

/**
 * Payload sent to the AI service (FastAPI or mock).
 * Kept flat so it's trivially serialisable to JSON.
 */
export interface AiRecommendationRequest {
  soilType: string;
  totalArea: number;
  waterSource: string;
  season: string;
  village: string;
  district: string;
  state: string;
  country: string;
}

export interface AiRecommendationResponse {
  recommendations: ICropRecommendation[];
  provider: string;
  processingTimeMs: number;
}

// ─── Repository Interface ─────────────────────────────────────────────────────

export interface IRecommendationRepository {
  create(data: CreateRecommendationRecord): Promise<IRecommendation>;
  findById(id: string): Promise<IRecommendation | null>;
  findHistory(
    userId: Types.ObjectId,
    query: RecommendationHistoryQuery
  ): Promise<PaginatedRecommendations>;
  update(id: string, data: Partial<UpdateRecommendationRecord>): Promise<IRecommendation | null>;
  softDelete(id: string): Promise<IRecommendation | null>;
}

// ─── Service Interface ────────────────────────────────────────────────────────

export interface IRecommendationService {
  createRecommendation(
    userId: string,
    dto: CreateRecommendationDto
  ): Promise<IRecommendation>;

  getHistory(
    userId: string,
    query: RecommendationHistoryQuery
  ): Promise<PaginatedRecommendations>;

  getRecommendationById(
    id: string,
    requesterId: string,
    requesterRole: string
  ): Promise<IRecommendation>;

  deleteRecommendation(
    id: string,
    requesterId: string,
    requesterRole: string
  ): Promise<void>;
}

// ─── Internal Records ─────────────────────────────────────────────────────────

export interface CreateRecommendationRecord {
  userId: Types.ObjectId;
  farmId: Types.ObjectId;
  season: Season;
  year: number;
  inputData: IInputData;
  recommendations: ICropRecommendation[];
  aiProvider: string;
  processingTime: number;
  status: RecommendationStatus;
}

export interface UpdateRecommendationRecord {
  recommendations: ICropRecommendation[];
  aiProvider: string;
  processingTime: number;
  status: RecommendationStatus;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedRecommendations {
  recommendations: IRecommendation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
