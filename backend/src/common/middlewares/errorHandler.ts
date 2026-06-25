import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiResponse, AppError } from "../utils/apiResponse";

/**
 * Centralized error handler. Mount this last in the Express app.
 * Handles AppError (our own thrown errors), Zod validation errors,
 * Mongoose errors, and falls back to a generic 500.
 */
export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  if (err instanceof ZodError) {
    return ApiResponse.error(res, "Validation failed", 400, {
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  if (err instanceof Error && err.name === "CastError") {
    return ApiResponse.error(res, "Invalid identifier supplied", 400);
  }

  console.error("[Unhandled Error]", err);

  return ApiResponse.error(res, "Internal server error", 500);
};
