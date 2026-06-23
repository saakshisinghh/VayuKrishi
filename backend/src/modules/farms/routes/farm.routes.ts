import { Router } from 'express';
import { FarmController } from '../controllers/farm.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  createFarmSchema,
  updateFarmSchema,
  farmIdParamSchema,
  farmQuerySchema,
} from '../validators/farm.validator';

const router = Router();
const farmController = new FarmController();

/**
 * All farm routes require a valid JWT.
 * Fine-grained owner/admin checks are handled inside FarmService.
 */
router.use(authenticate);

/**
 * POST   /api/v1/farms          — Create a new farm
 * GET    /api/v1/farms          — List current user's farms (paginated)
 * GET    /api/v1/farms/:id      — Get a specific farm
 * PATCH  /api/v1/farms/:id      — Partially update a farm
 * DELETE /api/v1/farms/:id      — Soft-delete a farm
 */
router
  .route('/')
  .post(validate(createFarmSchema), farmController.createFarm)
  .get(validate(farmQuerySchema), farmController.getUserFarms);

router
  .route('/:id')
  .get(validate(farmIdParamSchema), farmController.getFarmById)
  .patch(validate(updateFarmSchema), farmController.updateFarm)
  .delete(validate(farmIdParamSchema), farmController.deleteFarm);

export default router;
