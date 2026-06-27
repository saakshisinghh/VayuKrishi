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
import cropRoutes from '../modules/crop-recommendation/routes/recommendation.routes';
import diseaseRoutes from '../modules/disease-detection/routes/disease.routes';
import marketRoutes from "../modules/market/routes/market.routes";
import schemeRoutes from '../modules/schemes/routes/scheme.routes';
import notificationRoutes from "../modules/notifications/routes/notification.routes";
import analyticsRoutes from '../modules/analytics/routes/analytics.routes';
 

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/farms', farmRoutes);
router.use('/uploads', uploadRoutes);
router.use('/crop', cropRoutes);
router.use('/disease', diseaseRoutes);
router.use('/market', marketRoutes);
router.use('/schemes', schemeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
