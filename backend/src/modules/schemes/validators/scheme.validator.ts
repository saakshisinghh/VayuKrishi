import { z } from 'zod';
import { SchemeCategory } from '../scheme.model';
import { ApplicationStatus } from '../application.model';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const objectId = (field = 'id') =>
  z.string({ required_error: `${field} is required` })
   .regex(/^[a-fA-F0-9]{24}$/, `${field} must be a valid ObjectId`);

const paginationQuery = z.object({
  page:  z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

// ─── GET / ────────────────────────────────────────────────────────────────────

export const listSchemesSchema = z.object({
  query: paginationQuery.extend({
    category: z.nativeEnum(SchemeCategory).optional(),
    state:    z.string().trim().optional(),
    isActive: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  }),
});

export type ListSchemesQuery = z.infer<typeof listSchemesSchema>['query'];

// ─── GET /search ──────────────────────────────────────────────────────────────

export const searchSchemesSchema = z.object({
  query: paginationQuery.extend({
    q:        z.string().trim().min(1, 'Search query is required').optional(),
    category: z.nativeEnum(SchemeCategory).optional(),
  }),
});

export type SearchSchemesQuery = z.infer<typeof searchSchemesSchema>['query'];

// ─── GET /:id ─────────────────────────────────────────────────────────────────

export const schemeIdParamSchema = z.object({
  params: z.object({ id: objectId('id') }),
});

// ─── POST /check-eligibility ──────────────────────────────────────────────────

export const checkEligibilitySchema = z.object({
  body: z.object({
    farmId:   objectId('farmId'),
    schemeId: objectId('schemeId'),
  }),
});

export type CheckEligibilityBody = z.infer<typeof checkEligibilitySchema>['body'];

// ─── POST /apply ──────────────────────────────────────────────────────────────

const documentSchema = z.object({
  name:    z.string().trim().min(1),
  mediaId: objectId('mediaId'),
  url:     z.string().url('url must be a valid URL'),
});

export const applySchema = z.object({
  body: z.object({
    schemeId:           objectId('schemeId'),
    farmId:             objectId('farmId').optional(),
    submittedDocuments: z.array(documentSchema).default([]),
  }),
});

export type ApplyBody = z.infer<typeof applySchema>['body'];

// ─── GET /my-applications ─────────────────────────────────────────────────────

export const listApplicationsSchema = z.object({
  query: paginationQuery.extend({
    status: z.nativeEnum(ApplicationStatus).optional(),
  }),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>['query'];

// ─── GET /applications/:id ───────────────────────────────────────────────────

export const applicationIdParamSchema = z.object({
  params: z.object({ id: objectId('id') }),
});

// ─── PATCH /applications/:id/status ─────────────────────────────────────────

const updateableStatuses = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.UNDER_REVIEW,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
] as const;

export const updateStatusSchema = z.object({
  params: z.object({ id: objectId('id') }),
  body: z.object({
    status:  z.enum(updateableStatuses, { required_error: 'status is required' }),
    remarks: z.string().trim().optional(),
  }),
});

export type UpdateStatusBody = z.infer<typeof updateStatusSchema>['body'];
