import { Router } from 'express';
import { diseaseController } from '../controllers/disease.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate }               from '../../../middleware/validate';
import { UserRole }               from '../types/disease.types';
import {
  detectDiseaseSchema,
  getHistorySchema,
  reportIdParamSchema,
  verifyReportSchema,
  deleteReportSchema,
} from '../validators/disease.validator';

const router = Router();

/**
 * Base: /api/v1/disease
 */

// POST   /detect              — Farmer submits image for analysis
router.post(
  '/detect',
  authenticate,
  authorize(UserRole.FARMER, UserRole.ADMIN),
  validate(detectDiseaseSchema),
  diseaseController.detect.bind(diseaseController),
);

// GET    /history             — Get paginated disease history
router.get(
  '/history',
  authenticate,
  validate(getHistorySchema),
  diseaseController.getHistory.bind(diseaseController),
);

// GET    /history/:id         — Get single disease report
router.get(
  '/history/:id',
  authenticate,
  validate(reportIdParamSchema),
  diseaseController.getById.bind(diseaseController),
);

// PATCH  /verify/:id          — Mark report as verified (Admin / Consultant)
router.patch(
  '/verify/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.CONSULTANT),
  validate(verifyReportSchema),
  diseaseController.verify.bind(diseaseController),
);

// DELETE /history/:id         — Soft-delete report (Owner or Admin)
router.delete(
  '/history/:id',
  authenticate,
  validate(deleteReportSchema),
  diseaseController.deleteReport.bind(diseaseController),
);

// GET    /history/:id/download — Download report as text file
router.get(
  '/history/:id/download',
  authenticate,
  validate(reportIdParamSchema),
  diseaseController.download.bind(diseaseController),
);

// POST   /history/:id/share   — Generate shareable link
router.post(
  '/history/:id/share',
  authenticate,
  validate(reportIdParamSchema),
  diseaseController.share.bind(diseaseController),
);

export default router;