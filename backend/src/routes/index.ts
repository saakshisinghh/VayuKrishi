/**
 * routes/index.ts
 * ------------------
 * Central router. Mounts each module's routes under its namespace.
 * This whole router is mounted at API_PREFIX (/api/v1) in app.ts.
 * The /health check lives directly in app.ts at the true root, outside
 * the versioned prefix, since load balancers/uptime monitors conventionally
 * expect it there.
 */

import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import userRoutes from '../modules/users/routes/user.routes';
import farmRoutes from '../modules/farms/routes/farm.routes';
import uploadRoutes from '../modules/uploads/routes/upload.routes'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/farms', farmRoutes);
router.use('/uploads', uploadRoutes);


export default router;
