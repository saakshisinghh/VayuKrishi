import { FilterQuery, Types } from 'mongoose';
import Scheme, { IScheme } from '../scheme.model';
import { PaginatedResult } from '../types/scheme.types';
import { MockSchemeData } from '../types/scheme.types';

export class SchemeRepository {

  // ─── Find Many (list + filter) ───────────────────────────────────────────

  async findMany(
    filter: FilterQuery<IScheme>,
    page:   number,
    limit:  number,
  ): Promise<PaginatedResult<IScheme>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<IScheme[]>(),
      Scheme.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Find by ID ───────────────────────────────────────────────────────────

  async findById(id: string | Types.ObjectId): Promise<IScheme | null> {
    return Scheme.findById(id).lean<IScheme>();
  }

  // ─── Full-text search ─────────────────────────────────────────────────────

  async search(
    query:    string,
    category: string | undefined,
    page:     number,
    limit:    number,
  ): Promise<PaginatedResult<IScheme>> {
    const skip = (page - 1) * limit;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filter: FilterQuery<IScheme> = {
      isActive: true,
      ...(query    ? { $text: { $search: query } } : {}),
      ...(category ? { category }                  : {}),
    };

    const sortBy: any = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    const [data, total] = await Promise.all([
      Scheme.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean<IScheme[]>(),
      Scheme.countDocuments(filter),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Upsert (sync) ────────────────────────────────────────────────────────

  async upsertMany(schemes: MockSchemeData[]): Promise<{ upserted: number; modified: number }> {
    let upserted = 0;
    let modified = 0;

    for (const s of schemes) {
      const result = await Scheme.updateOne(
        { schemeCode: s.schemeCode },
        { $set: s },
        { upsert: true },
      );
      if (result.upsertedCount) upserted++;
      else if (result.modifiedCount) modified++;
    }

    return { upserted, modified };
  }

  // ─── Increment view count ─────────────────────────────────────────────────

  async incrementView(id: string | Types.ObjectId): Promise<void> {
    await Scheme.updateOne({ _id: id }, { $inc: { viewCount: 1 } });
  }

  // ─── Increment application count ──────────────────────────────────────────

  async incrementApplicationCount(id: string | Types.ObjectId): Promise<void> {
    await Scheme.updateOne({ _id: id }, { $inc: { applicationCount: 1 } });
  }
}

export const schemeRepository = new SchemeRepository();
