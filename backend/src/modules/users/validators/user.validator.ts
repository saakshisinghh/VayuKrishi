/**
 * modules/users/validators/user.validator.ts
 * -------------------------------------------------
 * Zod schema for PATCH /api/v1/users/profile.
 * Both fields optional, but at least one must be present.
 */

import { z } from 'zod';
import { Language } from '../../../shared/enums/user.enums';

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    language: z.nativeEnum(Language).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (name or language) must be provided',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
