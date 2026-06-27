import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .transform((val) => new Date(val));

// DateRangeObjectSchema is the plain, extendable object. DateRangeSchema
// adds the cross-field refinement (startDate <= endDate) and is used
// standalone when no further fields need to be added.
export const DateRangeObjectSchema = z.object({
  startDate: dateString.optional(),
  endDate: dateString.optional(),
});

export const DateRangeSchema = DateRangeObjectSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  { message: 'startDate must be before or equal to endDate' }
);

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100)),
});

// .extend() only works on a plain ZodObject, not on a refined
// ZodEffects, so every schema below extends a plain object and then
// re-applies this same cross-field date check afterward.
function withDateRangeCheck<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.refine(
    (data: { startDate?: Date; endDate?: Date }) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'startDate must be before or equal to endDate' }
  );
}

// ── Shared Filters ────────────────────────────────────────────
// Plain (unrefined) object so every schema below can keep extending it.
export const BaseFiltersObjectSchema = DateRangeObjectSchema.extend({
  state: z.string().trim().min(1).max(100).optional(),
  district: z.string().trim().min(1).max(100).optional(),
});

export const BaseFiltersSchema = withDateRangeCheck(BaseFiltersObjectSchema);

// ── Overview ──────────────────────────────────────────────────
export const OverviewQuerySchema = BaseFiltersSchema;
export type OverviewQuery = z.infer<typeof OverviewQuerySchema>;

// ── Farm ──────────────────────────────────────────────────────
export const FarmAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    groupBy: z.enum(['state', 'district', 'soilType', 'waterSource']).optional(),
  })
);
export type FarmAnalyticsQuery = z.infer<typeof FarmAnalyticsQuerySchema>;

// ── Crops ─────────────────────────────────────────────────────
export const CropAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    season: z.enum(['kharif', 'rabi', 'zaid', 'annual']).optional(),
    crop: z.string().trim().min(1).max(100).optional(),
  })
);
export type CropAnalyticsQuery = z.infer<typeof CropAnalyticsQuerySchema>;

// ── Diseases ──────────────────────────────────────────────────
export const DiseaseAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    verified: z
      .string()
      .optional()
      .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  })
);
export type DiseaseAnalyticsQuery = z.infer<typeof DiseaseAnalyticsQuerySchema>;

// ── Market ────────────────────────────────────────────────────
export const MarketAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    commodity: z.string().trim().min(1).max(100).optional(),
  })
);
export type MarketAnalyticsQuery = z.infer<typeof MarketAnalyticsQuerySchema>;

// ── Schemes ───────────────────────────────────────────────────
export const SchemeAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    category: z.string().trim().min(1).max(100).optional(),
  })
);
export type SchemeAnalyticsQuery = z.infer<typeof SchemeAnalyticsQuerySchema>;

// ── Notifications ─────────────────────────────────────────────
export const NotificationAnalyticsQuerySchema = withDateRangeCheck(
  BaseFiltersObjectSchema.extend({
    type: z.string().trim().min(1).max(50).optional(),
  })
);
export type NotificationAnalyticsQuery = z.infer<typeof NotificationAnalyticsQuerySchema>;

// ── Dashboard ─────────────────────────────────────────────────
export const DashboardQuerySchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid userId').optional(),
});
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;

// ── Reusable validate helper ───────────────────────────────────
export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): T {
  return schema.parse(query);
}