import { PipelineStage } from "mongoose";
import { marketRepository, MarketRepository } from "../repositories/market.repository";
import { marketCache, MarketCache } from "../market.cache";
import { generateMockMarketData } from "../jobs/mockDataGenerator";
import { ApiError } from "../../../utils/ApiError";
import { buildPaginationMeta, PaginationMeta } from "../../../utils/apiResponse";
import { logger } from "../../../config/logger";
import {
  CommoditySummary,
  DateRangeFilters,
  MarketSource,
  PriceFilters,
  SyncResult,
  TrendingCommodityItem,
  TrendingResult,
} from "../types/market.types";
import { MarketPriceDocument } from "../market.model";

export class MarketService {
  constructor(
    private readonly repository: MarketRepository = marketRepository,
    private readonly cache: MarketCache = marketCache
  ) {}

  /**
   * GET /prices
   * Returns latest market prices, paginated and filtered.
   * Cached for MARKET_CACHE_TTL_SECONDS (default 15 min).
   */
  async getPrices(
    filters: PriceFilters,
    page: number,
    limit: number
  ): Promise<{ records: MarketPriceDocument[]; meta: PaginationMeta }> {
    const cacheKey = this.cache.buildKey(
      `prices:${JSON.stringify(filters)}:${page}:${limit}`
    );

    const cached = await this.cache.get<{
      records: MarketPriceDocument[];
      meta: PaginationMeta;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const { records, total } = await this.repository.findMany(
      filters,
      page,
      limit
    );

    const result = {
      records,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * GET /prices/:id
   */
  async getPriceById(id: string): Promise<MarketPriceDocument> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw ApiError.notFound("Market price record not found");
    }
    return record;
  }

  /**
   * GET /commodity/:name
   * Aggregated view: current price, highest/lowest market, average.
   */
  async getCommodityData(commodityName: string): Promise<{
    summary: CommoditySummary;
    records: MarketPriceDocument[];
  }> {
    const cacheKey = this.cache.buildKey(`commodity:${commodityName.toLowerCase()}`);

    const cached = await this.cache.get<{
      summary: CommoditySummary;
      records: MarketPriceDocument[];
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const records = await this.repository.findByCommodity(commodityName);

    if (records.length === 0) {
      throw ApiError.notFound(
        `No market data found for commodity: ${commodityName}`
      );
    }

    const summary = this.buildCommoditySummary(commodityName, records);
    const result = { summary, records };

    await this.cache.set(cacheKey, result);
    return result;
  }

  private buildCommoditySummary(
    commodityName: string,
    records: MarketPriceDocument[]
  ): CommoditySummary {
    let highest = records[0];
    let lowest = records[0];
    let priceSum = 0;

    for (const record of records) {
      if (record.modalPrice > highest.modalPrice) highest = record;
      if (record.modalPrice < lowest.modalPrice) lowest = record;
      priceSum += record.modalPrice;
    }

    const sortedByDate = [...records].sort(
      (a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime()
    );

    return {
      commodity: commodityName,
      currentPrice: sortedByDate[0].modalPrice,
      highestMarket: {
        market: highest.market,
        state: highest.state,
        modalPrice: highest.modalPrice,
      },
      lowestMarket: {
        market: lowest.market,
        state: lowest.state,
        modalPrice: lowest.modalPrice,
      },
      averagePrice: Math.round((priceSum / records.length) * 100) / 100,
      totalMarketsReporting: new Set(records.map((r) => r.market)).size,
      lastUpdated: sortedByDate[0].arrivalDate,
    };
  }

  /**
   * GET /history
   * Historical, chronologically-ordered records for charting/forecasting.
   */
  async getPriceHistory(
    filters: PriceFilters,
    dateRange: DateRangeFilters,
    page: number,
    limit: number
  ): Promise<{ records: MarketPriceDocument[]; meta: PaginationMeta }> {
    const { records, total } = await this.repository.findHistory(
      filters,
      dateRange,
      page,
      limit
    );

    return {
      records,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /**
   * GET /trending
   * Compares average modal price over the last `windowDays` against
   * the previous equivalent window, per commodity, to surface
   * gainers/losers. Also surfaces most-traded commodities and top markets.
   */
  async getTrendingCommodities(
    limit: number,
    windowDays: number
  ): Promise<TrendingResult> {
    const cacheKey = this.cache.buildKey(`trending:${limit}:${windowDays}`);
    const cached = await this.cache.get<TrendingResult>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const currentWindowStart = new Date(now);
    currentWindowStart.setDate(currentWindowStart.getDate() - windowDays);

    const previousWindowStart = new Date(currentWindowStart);
    previousWindowStart.setDate(previousWindowStart.getDate() - windowDays);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          arrivalDate: { $gte: previousWindowStart, $lte: now },
        },
      },
      {
        $project: {
          commodity: 1,
          modalPrice: 1,
          market: 1,
          state: 1,
          period: {
            $cond: [
              { $gte: ["$arrivalDate", currentWindowStart] },
              "current",
              "previous",
            ],
          },
        },
      },
      {
        $group: {
          _id: { commodity: "$commodity", period: "$period" },
          avgPrice: { $avg: "$modalPrice" },
          count: { $sum: 1 },
        },
      },
    ];

    const grouped = await this.repository.aggregate<{
      _id: { commodity: string; period: "current" | "previous" };
      avgPrice: number;
      count: number;
    }>(pipeline);

    const byCommodity = new Map<
      string,
      { current?: number; previous?: number; currentCount: number }
    >();

    for (const row of grouped) {
      const entry = byCommodity.get(row._id.commodity) ?? {
        currentCount: 0,
      };
      if (row._id.period === "current") {
        entry.current = row.avgPrice;
        entry.currentCount = row.count;
      } else {
        entry.previous = row.avgPrice;
      }
      byCommodity.set(row._id.commodity, entry);
    }

    const changes: TrendingCommodityItem[] = [];

    for (const [commodity, data] of byCommodity.entries()) {
      if (data.current === undefined || data.previous === undefined) continue;

      const changeAmount = Math.round((data.current - data.previous) * 100) / 100;
      const changePercent =
        data.previous === 0
          ? 0
          : Math.round((changeAmount / data.previous) * 10000) / 100;

      changes.push({
        commodity,
        previousAvgPrice: Math.round(data.previous * 100) / 100,
        currentAvgPrice: Math.round(data.current * 100) / 100,
        changeAmount,
        changePercent,
        recordCount: data.currentCount,
      });
    }

    const topGainers = [...changes]
      .filter((c) => c.changeAmount > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit);

    const topLosers = [...changes]
      .filter((c) => c.changeAmount < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit);

    const mostTradedPipeline: PipelineStage[] = [
      { $match: { arrivalDate: { $gte: currentWindowStart, $lte: now } } },
      { $group: { _id: "$commodity", recordCount: { $sum: 1 } } },
      { $sort: { recordCount: -1 } },
      { $limit: limit },
    ];

    const mostTradedRaw = await this.repository.aggregate<{
      _id: string;
      recordCount: number;
    }>(mostTradedPipeline);

    const topMarketsPipeline: PipelineStage[] = [
      { $match: { arrivalDate: { $gte: currentWindowStart, $lte: now } } },
      {
        $group: {
          _id: { market: "$market", state: "$state" },
          recordCount: { $sum: 1 },
        },
      },
      { $sort: { recordCount: -1 } },
      { $limit: limit },
    ];

    const topMarketsRaw = await this.repository.aggregate<{
      _id: { market: string; state: string };
      recordCount: number;
    }>(topMarketsPipeline);

    const result: TrendingResult = {
      topGainers,
      topLosers,
      mostTraded: mostTradedRaw.map((r) => ({
        commodity: r._id,
        recordCount: r.recordCount,
      })),
      topMarkets: topMarketsRaw.map((r) => ({
        market: r._id.market,
        state: r._id.state,
        recordCount: r.recordCount,
      })),
      generatedAt: now,
    };

    await this.cache.set(cacheKey, result, 300); // shorter TTL: 5 min
    return result;
  }

  /**
   * POST /sync (admin only)
   * Inserts mock data today; swap `generateMockMarketData` for a real
   * Agmarknet/government-API client later without changing this method's
   * signature or the controller/route that calls it.
   */
  async syncMarketData(
    commodities?: string[],
    recordCount = 25
  ): Promise<SyncResult> {
    const source: MarketSource = "MOCK";
    const mockData = generateMockMarketData(commodities, recordCount, source);

    const inserted = await this.repository.insertMany(mockData);

    await this.cache.invalidateAll();

    logger.info(`Market sync complete: ${inserted.length} records inserted`);

    return {
      inserted: inserted.length,
      source,
      syncedAt: new Date(),
    };
  }
}

export const marketService = new MarketService();
