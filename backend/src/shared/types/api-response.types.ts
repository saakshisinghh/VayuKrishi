/**
 * shared/types/api-response.types.ts
 * ------------------------------------
 * Shape of every response the API sends, success or error.
 * Matches the format specified in the project brief.
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: Record<string, unknown> | unknown[] | null;
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
