import { z } from 'zod';

// ─── Reusable ─────────────────────────────────────────────────────────────────

const seasonEnum = z.enum(['kharif', 'rabi', 'zaid'], {
  errorMap: () => ({ message: "Season must be 'kharif', 'rabi', or 'zaid'" }),
});

const mongoIdRegex = /^[a-f\d]{24}$/i;

// ─── POST /recommend ──────────────────────────────────────────────────────────

export const createRecommendationSchema = z.object({
  body: z.object({
    farmId: z
      .string({ required_error: 'farmId is required' })
      .regex(mongoIdRegex, 'farmId must be a valid MongoDB ObjectId'),

    season: seasonEnum,
  }),
});

// ─── GET /history ─────────────────────────────────────────────────────────────

export const historyQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1))
      .refine((v) => v > 0, { message: 'page must be a positive integer' }),

    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 10))
      .refine((v) => v > 0 && v <= 100, {
        message: 'limit must be between 1 and 100',
      }),

    season: seasonEnum.optional(),

    year: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined))
      .refine((v) => v === undefined || (v >= 2000 && v <= 2100), {
        message: 'year must be between 2000 and 2100',
      }),

    sortOrder: z.enum(['newest', 'oldest']).optional().default('newest'),
  }),
});

// ─── Params: /:id ─────────────────────────────────────────────────────────────

export const recommendationIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Recommendation ID is required' })
      .regex(mongoIdRegex, 'Invalid recommendation ID'),
  }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateRecommendationInput = z.infer<
  typeof createRecommendationSchema
>['body'];

export type HistoryQueryInput = z.infer<typeof historyQuerySchema>['query'];
