/**
 * app.ts
 * --------
 * Configures the Express application: security middleware, body parsing,
 * compression, request logging, rate limiting, route mounting, the
 * standalone /health endpoint, and finally the 404 + error handlers
 * (which must be registered LAST so they catch everything above them).
 *
 * This file exports the configured `app` but does NOT call app.listen() —
 * that happens in server.ts, which also owns DB/Redis connection and
 * graceful shutdown.
 */

import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import { env } from './config/env';
import { requestLogger } from './middleware/request-logger.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { notFoundHandler, errorMiddleware } from './middleware/error.middleware';
import { sendSuccess } from './shared/utils/api-response';
import routes from './routes';
import { initCloudinary } from './config/cloudinary';
import { analyticsRouter } from "./modules/analytics";
import personalAnalyticsRoutes from "./modules/personal-analytics/routes/personal-analytics.routes";


initCloudinary();

export function createApp(): Application {
  const app = express();

  // ---------- Security ----------
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );

  // ---------- Body parsing ----------
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // ---------- Sanitization (prevents MongoDB operator injection, e.g. {"$gt": ""}) ----------
  app.use(mongoSanitize());

  // ---------- Performance ----------
  app.use(compression());

  // ---------- Logging ----------
  app.use(requestLogger);

  // ---------- Rate limiting (general, global) ----------
  app.use(generalLimiter);

  // ---------- Health check (unversioned, at true root) ----------
  app.get('/health', (_req: Request, res: Response) => {
    sendSuccess(res, null, 'Vayukrishi API is running');
  });

  // ---------- Versioned API routes ----------
  app.use(env.API_PREFIX, routes);
  app.use(`${env.API_PREFIX}/analytics/admin`, analyticsRouter);
  app.use(`${env.API_PREFIX}/analytics`, personalAnalyticsRoutes);

  // ---------- 404 + centralized error handling (must be last) ----------
  app.use(notFoundHandler);
  app.use(errorMiddleware);

  return app;
}
