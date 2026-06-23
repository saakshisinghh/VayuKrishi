import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Central Express error handler.
 * Must be registered AFTER all routes.
 *
 * Handles:
 *  - AppError (operational, expected errors)
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose ValidationError
 *  - Mongoose duplicate key error (code 11000)
 *  - JWT errors (propagated from auth middleware)
 *  - Unknown errors (500)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational errors we threw ourselves
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, {
      type: err.constructor.name,
    });
    return;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid resource ID format', {
      type: 'CastError',
    });
    return;
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, err.message, {
      type: 'MongooseValidationError',
    });
    return;
  }

  // MongoDB duplicate key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).code === 11000) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    sendError(
      res,
      HTTP_STATUS.CONFLICT,
      `Duplicate value for ${field}`,
      { type: 'DuplicateKeyError', field }
    );
    return;
  }

  // Fallback — unexpected server error
  console.error('[UNHANDLED ERROR]', err);
  sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};
