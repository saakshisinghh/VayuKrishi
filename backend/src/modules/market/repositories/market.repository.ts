import { FilterQuery, PipelineStage, Types } from "mongoose";
import { MarketPrice, MarketPriceDocument } from "../market.model";
import {
  DateRangeFilters,
  IMarketPrice,
  PriceFilters,
} from "../types/market.types";

/**
 * Repository layer — owns all direct Mongoose/MongoDB access for
 * the market module. Services should never talk to the model directly.
 */
export class MarketRepository {
  /**
   * Builds a case-insensitive Mongo filter from the supported price filters.
   */
  private buildFilterQuery(
    filters: PriceFilters
  ): FilterQuery<MarketPriceDocument> {
    const query: FilterQuery<MarketPriceDocument> = {};

    if (filters.commodity) {
      query.commodity = new RegExp(`^${escapeRegex(filters.commodity)}$`, "i");
    }
    if (filters.state) {
      query.state = new RegExp(`^${escapeRegex(filters.state)}$`, "i");
    }
    if (filters.district) {
      query.district = new RegExp(`^${escapeRegex(filters.district)}$`, "i");
    }
    if (filters.market) {
      query.market = new RegExp(`^${escapeRegex(filters.market)}$`, "i");
    }

    return query;
  }

  async create(data: IMarketPrice): Promise<MarketPriceDocument> {
    return MarketPrice.create(data);
  }

  async insertMany(data: IMarketPrice[]): Promise<MarketPriceDocument[]> {
    return MarketPrice.insertMany(data, { ordered: false });
  }

  async findById(id: string): Promise<MarketPriceDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return MarketPrice.findById(id).lean<MarketPriceDocument>().exec();
  }

  /**
   * Finds the latest price records matching filters, paginated.
   * "Latest" = most recent arrivalDate first.
   */
  async findMany(
    filters: PriceFilters,
    page: number,
    limit: number
  ): Promise<{ records: MarketPriceDocument[]; total: number }> {
    const query = this.buildFilterQuery(filters);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      MarketPrice.find(query)
        .sort({ arrivalDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<MarketPriceDocument[]>()
        .exec(),
      MarketPrice.countDocuments(query),
    ]);

    return { records, total };
  }

  async findByCommodity(commodity: string): Promise<MarketPriceDocument[]> {
    return MarketPrice.find({
      commodity: new RegExp(`^${escapeRegex(commodity)}$`, "i"),
    })
      .sort({ arrivalDate: -1 })
      .lean<MarketPriceDocument[]>()
      .exec();
  }

  /**
   * Finds historical records within a date range and optional filters,
   * paginated, sorted ascending by arrival date (chronological for charts).
   */
  async findHistory(
    filters: PriceFilters,
    dateRange: DateRangeFilters,
    page: number,
    limit: number
  ): Promise<{ records: MarketPriceDocument[]; total: number }> {
    const query = this.buildFilterQuery(filters);

    if (dateRange.startDate || dateRange.endDate) {
      query.arrivalDate = {};
      if (dateRange.startDate) query.arrivalDate.$gte = dateRange.startDate;
      if (dateRange.endDate) query.arrivalDate.$lte = dateRange.endDate;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      MarketPrice.find(query)
        .sort({ arrivalDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MarketPriceDocument[]>()
        .exec(),
      MarketPrice.countDocuments(query),
    ]);

    return { records, total };
  }

  /**
   * Generic aggregation passthrough — kept so the service layer can
   * compose pipelines (summary stats, trending, volatility, etc.)
   * without the repository needing a bespoke method for every report.
   */
  async aggregate<T = unknown>(pipeline: PipelineStage[]): Promise<T[]> {
    return MarketPrice.aggregate<T>(pipeline).exec();
  }

  async countAll(): Promise<number> {
    return MarketPrice.countDocuments({});
  }

  async deleteAll(): Promise<number> {
    const result = await MarketPrice.deleteMany({});
    return result.deletedCount ?? 0;
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const marketRepository = new MarketRepository();
