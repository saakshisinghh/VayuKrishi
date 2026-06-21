/**
 * shared/utils/api-error.ts
 * ---------------------------
 * A single error class used throughout the codebase for any
 * "expected" error (validation failure, not found, unauthorized, etc).
 * The global error middleware knows how to turn this into the standard
 * error response shape. Unexpected (programmer) errors are NOT instances
 * of this class and are treated as 500s with details hidden in production.
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: Record<string, unknown> | unknown[] | null;

  constructor(
    statusCode: number,
    message: string,
    details: Record<string, unknown> | unknown[] | null = null,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details: Record<string, unknown> | unknown[] | null = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, null, false);
  }
}
