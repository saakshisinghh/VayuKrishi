import { Types } from 'mongoose';
import { IFarm } from '../farm.model';
import {
  IFarmService,
  IFarmRepository,
  CreateFarmDto,
  UpdateFarmDto,
  FarmQueryParams,
  PaginatedFarms,
} from '../types/farm.types';
import { FarmRepository } from '../repositories/farm.repository';
import { AppError } from '../../../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpStatus';

export class FarmService implements IFarmService {
  private readonly farmRepository: IFarmRepository;

  constructor(farmRepository?: IFarmRepository) {
    this.farmRepository = farmRepository ?? new FarmRepository();
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Fetch farm and throw 404 if not found or soft-deleted.
   */
  private async findActiveOrFail(farmId: string): Promise<IFarm> {
    const farm = await this.farmRepository.findById(farmId);

    if (!farm) {
      throw new AppError('Farm not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!farm.isActive) {
      throw new AppError('Farm has been deactivated', HTTP_STATUS.GONE);
    }

    return farm;
  }

  /**
   * Verify that requesterId is the farm owner OR has admin role.
   */
  private assertOwnerOrAdmin(
    farm: IFarm,
    requesterId: string,
    requesterRole: string
  ): void {
    const isOwner = farm.userId.toString() === requesterId;
    const isAdmin = requesterRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You are not authorized to access this farm',
        HTTP_STATUS.FORBIDDEN
      );
    }
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  async createFarm(userId: string, data: CreateFarmDto): Promise<IFarm> {
    const objectId = new Types.ObjectId(userId);
    return this.farmRepository.create(objectId, data);
  }

  async getUserFarms(
    userId: string,
    query: FarmQueryParams
  ): Promise<PaginatedFarms> {
    const objectId = new Types.ObjectId(userId);
    return this.farmRepository.findByUser(objectId, query);
  }

  async getFarmById(
    farmId: string,
    requesterId: string,
    requesterRole: string
  ): Promise<IFarm> {
    const farm = await this.findActiveOrFail(farmId);
    this.assertOwnerOrAdmin(farm, requesterId, requesterRole);
    return farm;
  }

  async updateFarm(
    farmId: string,
    data: UpdateFarmDto,
    requesterId: string,
    requesterRole: string
  ): Promise<IFarm> {
    const farm = await this.findActiveOrFail(farmId);
    this.assertOwnerOrAdmin(farm, requesterId, requesterRole);

    const updated = await this.farmRepository.update(farmId, data);

    if (!updated) {
      throw new AppError(
        'Farm update failed — record not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return updated;
  }

  async deleteFarm(
    farmId: string,
    requesterId: string,
    requesterRole: string
  ): Promise<IFarm> {
    const farm = await this.findActiveOrFail(farmId);
    this.assertOwnerOrAdmin(farm, requesterId, requesterRole);

    const deleted = await this.farmRepository.softDelete(farmId);

    if (!deleted) {
      throw new AppError(
        'Farm deletion failed — record not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return deleted;
  }
}
