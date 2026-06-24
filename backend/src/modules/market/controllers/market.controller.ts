import { Request, Response } from "express";
import { marketService } from "../services/market.service";
import { sendSuccess } from "../../../utils/apiResponse";
import {
  GetHistoryQuery,
  GetPricesQuery,
  GetTrendingQuery,
  SyncMarketBody,
} from "../validators/market.validator";

export class MarketController {
  async getPrices(req: Request, res: Response): Promise<void> {
    const q = req.query as unknown as GetPricesQuery;
    const page = typeof q.page === "number" ? q.page : 1;
    const limit = typeof q.limit === "number" ? q.limit : 20;
    const { records, meta } = await marketService.getPrices(
      { commodity: q.commodity, state: q.state, district: q.district, market: q.market },
      page,
      limit
    );
    sendSuccess(res, 200, "Market prices fetched successfully", { records, meta });
  }

  async getPriceById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const record = await marketService.getPriceById(id);
    sendSuccess(res, 200, "Market price record fetched successfully", record);
  }

  async getCommodityData(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const data = await marketService.getCommodityData(name);
    sendSuccess(res, 200, `Market data for ${name} fetched successfully`, data);
  }

  async getPriceHistory(req: Request, res: Response): Promise<void> {
    const q = req.query as unknown as GetHistoryQuery;
    const page = typeof q.page === "number" ? q.page : 1;
    const limit = typeof q.limit === "number" ? q.limit : 20;
    const { records, meta } = await marketService.getPriceHistory(
      { commodity: q.commodity, state: q.state, district: q.district },
      {
        startDate: q.startDate ? new Date(q.startDate) : undefined,
        endDate: q.endDate ? new Date(q.endDate) : undefined,
      },
      page,
      limit
    );
    sendSuccess(res, 200, "Price history fetched successfully", { records, meta });
  }

  async getTrending(req: Request, res: Response): Promise<void> {
    const q = req.query as unknown as GetTrendingQuery;
    const limit = typeof q.limit === "number" ? q.limit : 5;
    const windowDays = typeof q.windowDays === "number" ? q.windowDays : 7;
    const trending = await marketService.getTrendingCommodities(limit, windowDays);
    sendSuccess(res, 200, "Trending commodities fetched successfully", trending);
  }

  async syncMarketData(req: Request, res: Response): Promise<void> {
    const { commodities, recordCount } = req.body as SyncMarketBody;
    const result = await marketService.syncMarketData(commodities, recordCount);
    sendSuccess(res, 201, "Market data synchronized successfully", result);
  }
}

export const marketController = new MarketController();
