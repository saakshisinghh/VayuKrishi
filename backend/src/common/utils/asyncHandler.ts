import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers so rejected promises are forwarded to
 * Express's error-handling middleware instead of crashing the process.
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
