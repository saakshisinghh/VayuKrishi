import { FilterQuery, Types } from 'mongoose';
import Application, { IApplication, ApplicationStatus } from '../application.model';
import { PaginatedResult } from '../types/scheme.types';

export class ApplicationRepository {

  // ─── Create ───────────────────────────────────────────────────────────────

  async create(data: Partial<IApplication>): Promise<IApplication> {
    const app = new Application(data);
    return app.save();
  }

  // ─── Find by ID ───────────────────────────────────────────────────────────

  async findById(id: string | Types.ObjectId): Promise<IApplication | null> {
    return Application.findOne({ _id: id, isDeleted: false })
      .populate('schemeId', 'schemeName schemeCode category state')
      .populate('userId',   'name email')
      .lean<IApplication>();
  }

  // ─── Find paginated list ──────────────────────────────────────────────────

  async findMany(
    filter: FilterQuery<IApplication>,
    page:   number,
    limit:  number,
  ): Promise<PaginatedResult<IApplication>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('schemeId', 'schemeName schemeCode category')
        .lean<IApplication[]>(),
      Application.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  async update(
    id:      string | Types.ObjectId,
    payload: Partial<IApplication>,
  ): Promise<IApplication | null> {
    return Application.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: payload },
      { new: true, runValidators: true },
    ).lean<IApplication>();
  }

  // ─── Check duplicate ──────────────────────────────────────────────────────

  async existsByUserAndScheme(
    userId:   string | Types.ObjectId,
    schemeId: string | Types.ObjectId,
  ): Promise<boolean> {
    const doc = await Application.exists({ userId, schemeId, isDeleted: false });
    return !!doc;
  }

  // ─── Soft delete ──────────────────────────────────────────────────────────

  async softDelete(id: string | Types.ObjectId): Promise<void> {
    await Application.updateOne({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } });
  }

  // ─── Aggregate (analytics-ready) ─────────────────────────────────────────

  async countByStatus(schemeId: string | Types.ObjectId): Promise<Record<string, number>> {
    const result = await Application.aggregate([
      { $match: { schemeId: new Types.ObjectId(schemeId.toString()), isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return Object.fromEntries(result.map(r => [r._id as string, r.count as number]));
  }
}

export const applicationRepository = new ApplicationRepository();
