import { Router } from 'express';
import { schemeController } from '../controllers/scheme.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import { UserRole }                from '../types/scheme.types';
import {
  listSchemesSchema,
  searchSchemesSchema,
  schemeIdParamSchema,
  checkEligibilitySchema,
  applySchema,
  listApplicationsSchema,
  applicationIdParamSchema,
  updateStatusSchema,
} from '../validators/scheme.validator';

const router = Router();

/**
 * Base: /api/v1/schemes
 *
 * IMPORTANT: specific string routes (/search, /my-applications, /sync)
 * MUST be declared before parameterised routes (/:id) to avoid Express
 * treating "search" as an id.
 */

// GET  /search                — public full-text search
router.get(
  '/search',
  validate(searchSchemesSchema),
  schemeController.search.bind(schemeController),
);

// GET  /my-applications       — authenticated user's applications
router.get(
  '/my-applications',
  authenticate,
  validate(listApplicationsSchema),
  schemeController.myApplications.bind(schemeController),
);

// GET  /applications/:id      — single application detail
router.get(
  '/applications/:id',
  authenticate,
  validate(applicationIdParamSchema),
  schemeController.getApplication.bind(schemeController),
);

// PATCH /applications/:id/status — admin status update
router.patch(
  '/applications/:id/status',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateStatusSchema),
  schemeController.updateStatus.bind(schemeController),
);

// POST /sync                  — admin seed/sync
router.post(
  '/sync',
  authenticate,
  authorize(UserRole.ADMIN),
  schemeController.sync.bind(schemeController),
);

// POST /check-eligibility     — authenticated eligibility check
router.post(
  '/check-eligibility',
  authenticate,
  validate(checkEligibilitySchema),
  schemeController.checkEligibility.bind(schemeController),
);

// POST /apply                 — authenticated application
router.post(
  '/apply',
  authenticate,
  authorize(UserRole.FARMER, UserRole.ADMIN),
  validate(applySchema),
  schemeController.apply.bind(schemeController),
);

// GET  /                      — public scheme list
router.get(
  '/',
  validate(listSchemesSchema),
  schemeController.list.bind(schemeController),
);

// GET  /:id                   — public scheme detail
router.get(
  '/:id',
  validate(schemeIdParamSchema),
  schemeController.getById.bind(schemeController),
);

export default router;
