import { z } from 'zod';
import { Severity } from '../disease.model';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = (field: string) =>
  z.string({ required_error: `${field} is required` })
   .regex(objectIdRegex, { message: `${field} must be a valid MongoDB ObjectId` });

// ─── POST /detect ─────────────────────────────────────────────────────────────

export const detectDiseaseSchema = z.object({
  body: z.object({
    farmId: objectIdSchema('farmId'),
    mediaId: objectIdSchema('mediaId'),
    cropName: z
      .string({ required_error: 'cropName is required' })
      .trim()
      .min(2, 'cropName must be at least 2 characters')
      .max(100, 'cropName must be at most 100 characters'),
  }),
});

export type DetectDiseaseBody = z.infer<typeof detectDiseaseSchema>['body'];

// ─── GET /history ─────────────────────────────────────────────────────────────

export const getHistorySchema = z.object({
  query: z.object({
    page:      z.coerce.number().int().positive().optional().default(1),
    limit:     z.coerce.number().int().min(1).max(100).optional().default(10),
    cropName:  z.string().trim().optional(),
    severity:  z.nativeEnum(Severity).optional(),
    farmId:    objectIdSchema('farmId').optional(),
    sort:      z.enum(['newest', 'oldest']).optional().default('newest'),
  }),
});

export type GetHistoryQuery = z.infer<typeof getHistorySchema>['query'];

// ─── GET /history/:id  ────────────────────────────────────────────────────────

export const reportIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema('id'),
  }),
});

// ─── PATCH /verify/:id ───────────────────────────────────────────────────────

export const verifyReportSchema = z.object({
  params: z.object({
    id: objectIdSchema('id'),
  }),
});

// ─── DELETE /history/:id ─────────────────────────────────────────────────────

export const deleteReportSchema = z.object({
  params: z.object({
    id: objectIdSchema('id'),
  }),
});
