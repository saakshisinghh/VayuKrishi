import { Types } from 'mongoose';
import { SchemeCategory, FarmerCategory, IEligibilityCriteria } from '../scheme.model';
import { ApplicationStatus } from '../application.model';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export enum UserRole {
  FARMER     = 'farmer',
  CONSULTANT = 'consultant',
  ADMIN      = 'admin',
}

export interface AuthUser {
  _id:  string;
  role: UserRole;
}

// ─── Farmer profile (from User + Farm, used by eligibility engine) ────────────

export interface FarmerProfile {
  userId:       string;
  state:        string;
  farmSizeHa:   number;
  category:     FarmerCategory;
  cropTypes:    string[];
  waterSources: string[];
  age:          number | null;
  gender:       'male' | 'female' | 'other';
  annualIncome: number | null;
}

// ─── Eligibility ──────────────────────────────────────────────────────────────

export interface EligibilityResult {
  eligible:         boolean;
  score:            number;           // 0 – 100
  matchedCriteria:  string[];
  missingCriteria:  string[];
  details:          Record<string, unknown>;
}

export interface CheckEligibilityInput {
  farmId:   string;
  schemeId: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ApplyInput {
  schemeId:           string;
  farmId?:            string;
  submittedDocuments: Array<{
    name:    string;
    mediaId: string;
    url:     string;
  }>;
}

export interface UpdateStatusInput {
  status:  ApplicationStatus;
  remarks?: string;
}

// ─── Query types ──────────────────────────────────────────────────────────────

export interface ListSchemesQuery {
  page?:     number;
  limit?:    number;
  category?: SchemeCategory;
  state?:    string;
  isActive?: boolean;
}

export interface SearchSchemesQuery {
  q?:        string;
  category?: SchemeCategory;
  page?:     number;
  limit?:    number;
}

export interface ListApplicationsQuery {
  page?:   number;
  limit?:  number;
  status?: ApplicationStatus;
}

// ─── Repository interfaces ────────────────────────────────────────────────────

export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Mock sync seed data ─────────────────────────────────────────────────────

export interface MockSchemeData {
  schemeName:          string;
  schemeCode:          string;
  description:         string;
  benefits:            Array<{ type: string; description: string; amount: number | null; unit: string }>;
  category:            SchemeCategory;
  targetAudience:      string;
  state:               string;
  eligibilityCriteria: Partial<IEligibilityCriteria>;
  requiredDocuments:   string[];
  applicationLink:     string;
  officialWebsite:     string;
  startDate:           Date | null;
  endDate:             Date | null;
  isActive:            boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success:   true;
  message:   string;
  data:      T;
  timestamp: string;
}

export interface ApiError {
  success:   false;
  message:   string;
  error:     Record<string, unknown>;
  timestamp: string;
}


export type ApplyBody        = ApplyInput;
export type UpdateStatusBody = UpdateStatusInput;