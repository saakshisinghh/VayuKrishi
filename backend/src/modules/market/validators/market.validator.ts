import { z } from "zod";

/**
 * Coerces a query-string value into a positive integer with a fallback.
 */
const paginationNumber = (fallback: number, max?: number) =>
  z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val, 10) : fallback;
      if (Number.isNaN(parsed) || parsed < 1) return fallback;
      if (max && parsed > max) return max;
      return parsed;
    });

export const paginationSchema = z.object({
  page: paginationNumber(1),
  limit: paginationNumber(20, 100),
});

export const priceFiltersSchema = z.object({
  commodity: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
  market: z.string().trim().min(1).optional(),
});

/**
 * GET /prices
 */
export const getPricesQuerySchema = paginationSchema.merge(priceFiltersSchema);

/**
 * GET /prices/:id
 */
export const marketIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid market record id"),
});

/**
 * GET /commodity/:name
 */
export const commodityNameParamSchema = z.object({
  name: z.string().trim().min(1, "Commodity name is required"),
});

/**
 * GET /history
 */
export const getHistoryQuerySchema = paginationSchema
  .merge(
    z.object({
      commodity: z.string().trim().min(1).optional(),
      state: z.string().trim().min(1).optional(),
      district: z.string().trim().min(1).optional(),
      startDate: z
        .string()
        .optional()
        .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
          message: "startDate must be a valid date",
        }),
      endDate: z
        .string()
        .optional()
        .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
          message: "endDate must be a valid date",
        }),
    })
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "startDate must be before or equal to endDate",
      path: ["startDate"],
    }
  );

/**
 * GET /trending
 */
export const getTrendingQuerySchema = z.object({
  limit: paginationNumber(5, 20),
  windowDays: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val, 10) : 7;
      return Number.isNaN(parsed) || parsed < 1 ? 7 : parsed;
    }),
});

/**
 * POST /sync
 */
export const syncMarketBodySchema = z.object({
  commodities: z.array(z.string().trim().min(1)).optional(),
  recordCount: z.number().int().min(1).max(500).optional().default(25),
});

export type GetPricesQuery = z.infer<typeof getPricesQuerySchema>;
export type GetHistoryQuery = z.infer<typeof getHistoryQuerySchema>;
export type GetTrendingQuery = z.infer<typeof getTrendingQuerySchema>;
export type SyncMarketBody = z.infer<typeof syncMarketBodySchema>;
