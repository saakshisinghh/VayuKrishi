import { Types } from 'mongoose';
import { IDiseaseAnalysis, Severity, DetectionStatus, AiProvider } from '../disease.model';

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface DetectDiseaseInput {
  farmId: string;
  mediaId: string;
  cropName: string;
}

export interface GetHistoryQuery {
  page?: number;
  limit?: number;
  cropName?: string;
  severity?: Severity;
  farmId?: string;
  sort?: 'newest' | 'oldest';
}

export interface VerifyReportInput {
  verifiedByExpert: true;
}

// ─── AI Client Interfaces ─────────────────────────────────────────────────────

export interface AiDetectRequest {
  cropName: string;
  imageUrl: string;
  mediaId: string;
}

export interface AiDetectResponse {
  diseaseName: string;
  confidence: number;
  severity: Severity;
  affectedArea: number;
  cause: string;
  treatmentPlan: Array<{
    step: number;
    action: string;
    product: string;
    quantity: string;
  }>;
  preventiveMeasures: string[];
  processingTime?: number;
  provider?: AiProvider;
}

// ─── Repository Layer ─────────────────────────────────────────────────────────

export interface CreateDiseaseReportData {
  userId: Types.ObjectId;
  farmId: Types.ObjectId;
  mediaId: Types.ObjectId;
  cropName: string;
  analysis: IDiseaseAnalysis | null;
  status: DetectionStatus;
  aiProvider: AiProvider;
  processingTime: number | null;
}

export interface FindHistoryFilter {
  userId?: Types.ObjectId;
  farmId?: Types.ObjectId;
  cropName?: string;
  'analysis.severity'?: Severity;
  isDeleted: boolean;
  status?: DetectionStatus;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: Record<string, unknown>;
  timestamp: string;
}

// ─── User roles (subset for this module) ─────────────────────────────────────

export enum UserRole {
  FARMER     = 'farmer',
  CONSULTANT = 'consultant',
  ADMIN      = 'admin',
}

export interface AuthUser {
  _id: string;
  userId: string;  
  role: UserRole;
}
