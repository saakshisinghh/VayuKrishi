import { z } from 'zod';

// ─── Reusable sub-schemas ─────────────────────────────────────────────────────

const locationSchema = z.object({
  village: z.string().trim().min(1, 'Village is required').max(100),
  district: z.string().trim().min(1, 'District is required').max(100),
  state: z.string().trim().min(1, 'State is required').max(100),
  country: z.string().trim().min(1, 'Country is required').max(100).default('India'),
  latitude: z
    .number({ required_error: 'Latitude is required' })
    .min(-90, 'Latitude must be ≥ -90')
    .max(90, 'Latitude must be ≤ 90'),
  longitude: z
    .number({ required_error: 'Longitude is required' })
    .min(-180, 'Longitude must be ≥ -180')
    .max(180, 'Longitude must be ≤ 180'),
});

const areaUnitEnum = z.enum(['acre', 'hectare'], {
  errorMap: () => ({ message: "Area unit must be 'acre' or 'hectare'" }),
});

const soilTypeEnum = z.enum(
  ['black', 'red', 'alluvial', 'laterite', 'sandy', 'clay', 'loamy'],
  { errorMap: () => ({ message: 'Invalid soil type' }) }
);

const waterSourceEnum = z.enum(
  ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler'],
  { errorMap: () => ({ message: 'Invalid water source' }) }
);

const cropSeasonEnum = z.enum(['kharif', 'rabi', 'zaid'], {
  errorMap: () => ({ message: "Crop season must be 'kharif', 'rabi', or 'zaid'" }),
});

// ─── Create Farm ──────────────────────────────────────────────────────────────

export const createFarmSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Farm name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),

    description: z
      .string()
      .trim()
      .max(500, 'Description must not exceed 500 characters')
      .optional()
      .default(''),

    location: locationSchema,

    totalArea: z
      .number({ required_error: 'Total area is required' })
      .positive('Total area must be a positive number')
      .min(0.01, 'Minimum area is 0.01'),

    areaUnit: areaUnitEnum,

    soilType: soilTypeEnum,

    waterSource: waterSourceEnum,

    currentCrop: z
      .string()
      .trim()
      .max(100, 'Crop name too long')
      .optional()
      .default(''),

    cropSeason: cropSeasonEnum,
  }),
});

// ─── Update Farm ──────────────────────────────────────────────────────────────

export const updateFarmSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid farm ID'),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      description: z.string().trim().max(500).optional(),
      location: locationSchema.partial().optional(),
      totalArea: z.number().positive().min(0.01).optional(),
      areaUnit: areaUnitEnum.optional(),
      soilType: soilTypeEnum.optional(),
      waterSource: waterSourceEnum.optional(),
      currentCrop: z.string().trim().max(100).optional(),
      cropSeason: cropSeasonEnum.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

// ─── Farm ID Params ───────────────────────────────────────────────────────────

export const farmIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid farm ID'),
  }),
});

// ─── Query Params ─────────────────────────────────────────────────────────────

export const farmQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, { message: 'Page must be a positive number' }),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      }),

    search: z.string().trim().optional(),
    district: z.string().trim().optional(),
    state: z.string().trim().optional(),
    soilType: soilTypeEnum.optional(),

    sortBy: z.enum(['createdAt', 'name']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateFarmInput = z.infer<typeof createFarmSchema>['body'];
export type UpdateFarmInput = z.infer<typeof updateFarmSchema>['body'];
export type FarmQueryInput = z.infer<typeof farmQuerySchema>['query'];
