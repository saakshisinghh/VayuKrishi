import { Router } from "express";
import { marketController } from "../controllers/market.controller";
import { asyncHandler } from "../../../utils/asyncHandler";
import { validate } from "../../../middlewares/validate";
import { requireAuth, requireRole } from "../../../middlewares/auth";
import {
  commodityNameParamSchema,
  getHistoryQuerySchema,
  getPricesQuerySchema,
  getTrendingQuerySchema,
  marketIdParamSchema,
  syncMarketBodySchema,
} from "../validators/market.validator";

const router = Router();

/**
 * @route   GET /api/v1/market/prices
 * @desc    Get latest market prices (paginated, filterable). Public.
 * @access  Public
 */
router.get(
  "/prices",
  validate(getPricesQuerySchema),
  asyncHandler((req, res) => marketController.getPrices(req, res))
);

/**
 * @route   GET /api/v1/market/trending
 * @desc    Top gainers/losers, most-traded commodities, top markets.
 * @access  Public
 * NOTE: registered before "/prices/:id" to avoid being shadowed,
 * but "trending" and "history" are non-numeric/non-ObjectId literal
 * segments so order vs "/prices/:id" specifically does not matter —
 * kept here for readability of route groupings.
 */
router.get(
  "/trending",
  validate(getTrendingQuerySchema),
  asyncHandler((req, res) => marketController.getTrending(req, res))
);

/**
 * @route   GET /api/v1/market/history
 * @desc    Historical prices with date range + filters.
 * @access  Public
 */
router.get(
  "/history",
  validate(getHistoryQuerySchema),
  asyncHandler((req, res) => marketController.getPriceHistory(req, res))
);

/**
 * @route   GET /api/v1/market/commodity/:name
 * @desc    Aggregated stats for a single commodity.
 * @access  Public
 */
router.get(
  "/commodity/:name",
  validate(commodityNameParamSchema, "params"),
  asyncHandler((req, res) => marketController.getCommodityData(req, res))
);

/**
 * @route   GET /api/v1/market/prices/:id
 * @desc    Get a single market price record by id.
 * @access  Public
 */
router.get(
  "/prices/:id",
  validate(marketIdParamSchema),
  asyncHandler((req, res) => marketController.getPriceById(req, res))
);

/**
 * @route   POST /api/v1/market/sync
 * @desc    Trigger market data synchronization (mock data for now).
 * @access  Admin only
 */
router.post(
  "/sync",
  requireAuth,
  requireRole("admin"),
  validate(syncMarketBodySchema),
  asyncHandler((req, res) => marketController.syncMarketData(req, res))
);

export default router;
