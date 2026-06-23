import { Types, FilterQuery, SortOrder } from 'mongoose';
import { Farm, IFarm } from '../farm.model';
import {
  IFarmRepository,
  CreateFarmDto,
  UpdateFarmDto,
  FarmQueryParams,
  PaginatedFarms,
} from '../types/farm.types';

export class FarmRepository implements IFarmRepository {
  /**
   * Persist a new farm document.
   */
  async create(userId: Types.ObjectId, data: CreateFarmDto): Promise<IFarm> {
    const farm = new Farm({ userId, ...data });
    return farm.save();
  }

  /**
   * Find a single farm by its ID (regardless of active status, so admins can
   * see soft-deleted records if needed — active filter applied in service).
   */
  async findById(farmId: string): Promise<IFarm | null> {
    return Farm.findById(farmId).lean<IFarm>();
  }

  /**
   * Return a paginated list of active farms for a given user with optional
   * text search, district/state/soilType filters, and sorting.
   */
  async findByUser(
    userId: Types.ObjectId,
    {
      page = 1,
      limit = 10,
      search,
      district,
      state,
      soilType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    }: FarmQueryParams
  ): Promise<PaginatedFarms> {
    const filter: FilterQuery<IFarm> = { userId, isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { currentCrop: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (district) filter['location.district'] = { $regex: district, $options: 'i' };
    if (state) filter['location.state'] = { $regex: state, $options: 'i' };
    if (soilType) filter.soilType = soilType;

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find(filter).sort(sort).skip(skip).limit(limit).lean<IFarm[]>(),
      Farm.countDocuments(filter),
    ]);

    return {
      farms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Apply a partial update to a farm document and return the updated version.
   */
  async update(farmId: string, data: UpdateFarmDto): Promise<IFarm | null> {
    // Flatten nested location updates so only provided sub-fields are changed.
    const updatePayload: Record<string, unknown> = {};

    const { location, ...rest } = data;

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) updatePayload[key] = value;
    });

    if (location) {
      Object.entries(location).forEach(([key, value]) => {
        if (value !== undefined) updatePayload[`location.${key}`] = value;
      });
    }

    return Farm.findByIdAndUpdate(
      farmId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).lean<IFarm>();
  }

  /**
   * Soft-delete: flip isActive to false instead of removing the document.
   */
  async softDelete(farmId: string): Promise<IFarm | null> {
    return Farm.findByIdAndUpdate(
      farmId,
      { $set: { isActive: false } },
      { new: true }
    ).lean<IFarm>();
  }
}
