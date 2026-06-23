import { Types, SortOrder } from 'mongoose';
import DiseaseReport, { IDiseaseReport } from '../disease.model';
import {
  CreateDiseaseReportData,
  FindHistoryFilter,
  PaginatedResult,
} from '../types/disease.types';

export class DiseaseRepository {
  // ─── Create ───────────────────────────────────────────────────────────────

  async create(data: CreateDiseaseReportData): Promise<IDiseaseReport> {
    const report = new DiseaseReport(data);
    return report.save();
  }

  // ─── Find by ID ───────────────────────────────────────────────────────────

  async findById(id: string | Types.ObjectId): Promise<IDiseaseReport | null> {
    return DiseaseReport.findOne({
      _id:       id,
      isDeleted: false,
    })
      .populate('userId',  'name email')
      .populate('farmId',  'name location')
      .populate('mediaId', 'url mimeType')
      .lean<IDiseaseReport>();
  }

  // ─── Find History (paginated) ─────────────────────────────────────────────

  async findHistory(
    filter: FindHistoryFilter,
    page: number,
    limit: number,
    sort: 'newest' | 'oldest',
  ): Promise<PaginatedResult<IDiseaseReport>> {
    const sortOrder: SortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DiseaseReport.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('farmId',  'name location')
        .populate('mediaId', 'url')
        .lean<IDiseaseReport[]>(),
      DiseaseReport.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IDiseaseReport>,
  ): Promise<IDiseaseReport | null> {
    return DiseaseReport.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: payload },
      { new: true, runValidators: true },
    ).lean<IDiseaseReport>();
  }

  // ─── Soft Delete ──────────────────────────────────────────────────────────

  async softDelete(id: string | Types.ObjectId): Promise<IDiseaseReport | null> {
    return DiseaseReport.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true },
    ).lean<IDiseaseReport>();
  }

  // ─── Existence helpers ────────────────────────────────────────────────────

  async existsForUser(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean> {
    const doc = await DiseaseReport.exists({
      _id:       id,
      userId,
      isDeleted: false,
    });
    return !!doc;
  }
}

export const diseaseRepository = new DiseaseRepository();
