/**
 * shared/utils/api-response.ts
 * -------------------------------
 * Helper functions to build standardized success/error response bodies.
 * Used by controllers (success) and the error middleware (error).
 */

import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '../types/api-response.types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

export function buildErrorResponse(
  message: string,
  error: Record<string, unknown> | unknown[] | null = null,
): ApiErrorResponse {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
}
