/**
 * shared/utils/async-handler.ts
 * --------------------------------
 * Wraps an async Express route handler so any thrown error (or rejected
 * promise) is automatically forwarded to next(), instead of requiring
 * a try/catch block in every single controller method.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(handler: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
