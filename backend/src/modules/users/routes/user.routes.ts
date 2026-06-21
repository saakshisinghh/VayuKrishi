/**
 * modules/users/routes/user.routes.ts
 * ------------------------------------------
 * PATCH /api/v1/users/profile - update the authenticated user's profile.
 * Protected: requires a valid access token.
 */

import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validation.middleware';
import { updateProfileSchema } from '../validators/user.validator';
import { updateProfile } from '../controllers/user.controller';

const router = Router();

router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
