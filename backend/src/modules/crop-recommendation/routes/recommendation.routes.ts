import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  createRecommendationSchema,
  historyQuerySchema,
  recommendationIdParamSchema,
} from '../validators/recommendation.validator';

const router = Router();
const ctrl   = new RecommendationController();

// All routes require a valid JWT
router.use(authenticate);

/**
 * POST   /api/v1/crop/recommend       — Generate crop recommendations
 * GET    /api/v1/crop/history         — Paginated recommendation history
 * GET    /api/v1/crop/history/:id     — Single recommendation detail
 * DELETE /api/v1/crop/history/:id     — Soft-delete a recommendation
 */
router.post(
  '/recommend',
  validate(createRecommendationSchema),
  ctrl.createRecommendation
);

router.get(
  '/history',
  validate(historyQuerySchema),
  ctrl.getHistory
);

router
  .route('/history/:id')
  .get(validate(recommendationIdParamSchema),    ctrl.getRecommendationById)
  .delete(validate(recommendationIdParamSchema), ctrl.deleteRecommendation);

export default router;
