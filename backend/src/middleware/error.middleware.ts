/**
 * middleware/error.middleware.ts
 * ----------------------------------
 * Two pieces:
 *  1. notFoundHandler - catches requests to routes that don't exist (404)
 *  2. errorMiddleware - the single place where every error in the app
 *     (thrown ApiError, Mongoose error, Zod error, or unexpected bug)
 *     is converted into the standard error response shape and logged.
 *
 * Must be registered AFTER all routes in app.ts.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../shared/utils/api-error';
import { buildErrorResponse } from '../shared/utils/api-response';
import { HttpStatus } from '../shared/constants/http-status';
import { logger } from '../config/logger';
import { isProduction } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(buildErrorResponse(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  // 1. Our own thrown, "expected" errors
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error('Non-operational ApiError', { message: err.message, stack: err.stack });
    }
    res.status(err.statusCode).json(buildErrorResponse(err.message, err.details));
    return;
  }

  // 2. Zod validation errors that slipped through without being wrapped
  if (err instanceof ZodError) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(buildErrorResponse('Validation failed', err.flatten().fieldErrors));
    return;
  }

  // 3. Mongoose duplicate key error (unique index violation)
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0] || 'field';
    res
      .status(HttpStatus.CONFLICT)
      .json(buildErrorResponse(`${field} already exists`));
    return;
  }

  // 4. Mongoose schema validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(buildErrorResponse('Validation failed', err.errors));
    return;
  }

  // 5. JWT errors (malformed/expired tokens not already caught by auth middleware)
  if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    res.status(HttpStatus.UNAUTHORIZED).json(buildErrorResponse('Invalid or expired token'));
    return;
  }

  // 6. Anything else: unexpected/programmer error. Log full detail, hide
  // internals from the client in production.
  const error = err instanceof Error ? err : new Error('Unknown error');
  logger.error('Unhandled error', { message: error.message, stack: error.stack });

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    buildErrorResponse(
      isProduction ? 'Internal server error' : error.message,
      isProduction ? null : { stack: error.stack },
    ),
  );
}
