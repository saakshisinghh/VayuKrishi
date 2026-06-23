import { Response } from 'express';

/**
 * Send a uniform success envelope.
 *
 * Shape:
 * {
 *   success: true,
 *   message: "...",
 *   data: <payload>,
 *   timestamp: "<ISO string>"
 * }
 */
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a uniform error envelope.
 *
 * Shape:
 * {
 *   success: false,
 *   message: "...",
 *   error: <details>,
 *   timestamp: "<ISO string>"
 * }
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error: unknown = null
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  });
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

