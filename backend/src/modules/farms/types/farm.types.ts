import { Types } from 'mongoose';
import { IFarm, IFarmLocation, AreaUnit, SoilType, WaterSource, CropSeason } from '../farm.model';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateFarmDto {
  name: string;
  description?: string;
  location: IFarmLocation;
  totalArea: number;
  areaUnit: AreaUnit;
  soilType: SoilType;
  waterSource: WaterSource;
  currentCrop?: string;
  cropSeason: CropSeason;
}

export interface UpdateFarmDto {
  name?: string;
  description?: string;
  location?: Partial<IFarmLocation>;
  totalArea?: number;
  areaUnit?: AreaUnit;
  soilType?: SoilType;
  waterSource?: WaterSource;
  currentCrop?: string;
  cropSeason?: CropSeason;
}

// ─── Query / Filter ──────────────────────────────────────────────────────────

export interface FarmQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
  state?: string;
  soilType?: SoilType;
  sortBy?: 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// ─── Repository Interfaces ───────────────────────────────────────────────────

export interface IFarmRepository {
  create(userId: Types.ObjectId, data: CreateFarmDto): Promise<IFarm>;
  findById(farmId: string): Promise<IFarm | null>;
  findByUser(userId: Types.ObjectId, query: FarmQueryParams): Promise<PaginatedFarms>;
  update(farmId: string, data: UpdateFarmDto): Promise<IFarm | null>;
  softDelete(farmId: string): Promise<IFarm | null>;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface IFarmService {
  createFarm(userId: string, data: CreateFarmDto): Promise<IFarm>;
  getUserFarms(userId: string, query: FarmQueryParams): Promise<PaginatedFarms>;
  getFarmById(farmId: string, requesterId: string, requesterRole: string): Promise<IFarm>;
  updateFarm(farmId: string, data: UpdateFarmDto, requesterId: string, requesterRole: string): Promise<IFarm>;
  deleteFarm(farmId: string, requesterId: string, requesterRole: string): Promise<IFarm>;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedFarms {
  farms: IFarm[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth helper types ────────────────────────────────────────────────────────

export type UserRole = 'farmer' | 'admin';
