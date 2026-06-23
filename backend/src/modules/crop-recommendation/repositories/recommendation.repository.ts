import { Types, FilterQuery, SortOrder } from 'mongoose';
import { Recommendation, IRecommendation } from '../recommendation.model';
import {
  IRecommendationRepository,
  CreateRecommendationRecord,
  UpdateRecommendationRecord,
  RecommendationHistoryQuery,
  PaginatedRecommendations,
} from '../types/recommendation.types';

export class RecommendationRepository implements IRecommendationRepository {
  /**
   * Persist a new recommendation document.
   */
  async create(data: CreateRecommendationRecord): Promise<IRecommendation> {
    const rec = new Recommendation(data);
    return rec.save();
  }

  /**
   * Find a recommendation by its _id (regardless of isActive — service decides).
   */
  async findById(id: string): Promise<IRecommendation | null> {
    return Recommendation.findById(id)
      .populate('farmId', 'name location totalArea areaUnit')
      .lean<IRecommendation>();
  }

  /**
   * Paginated history for a user, with optional season / year filters.
   */
  async findHistory(
    userId: Types.ObjectId,
    {
      page = 1,
      limit = 10,
      season,
      year,
      sortOrder = 'newest',
    }: RecommendationHistoryQuery
  ): Promise<PaginatedRecommendations> {
    const filter: FilterQuery<IRecommendation> = {
      userId,
      isActive: true,
    };

    if (season) filter.season = season;
    if (year)   filter.year   = year;

    const sort: Record<string, SortOrder> = {
      createdAt: sortOrder === 'oldest' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [recommendations, total] = await Promise.all([
      Recommendation.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-recommendations') // list view excludes heavy array
        .populate('farmId', 'name location')
        .lean<IRecommendation[]>(),

      Recommendation.countDocuments(filter),
    ]);

    return {
      recommendations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Partial update (used to write AI results back after async processing).
   */
  async update(
    id: string,
    data: Partial<UpdateRecommendationRecord>
  ): Promise<IRecommendation | null> {
    return Recommendation.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean<IRecommendation>();
  }

  /**
   * Soft-delete: set isActive = false.
   */
  async softDelete(id: string): Promise<IRecommendation | null> {
    return Recommendation.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean<IRecommendation>();
  }
}
