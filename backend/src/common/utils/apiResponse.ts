import { Response } from "express";

/**
 * Standard API response envelope used across all Vayukrishi modules.
 * Keeping this consistent lets the frontend rely on one shape everywhere.
 */

interface SuccessPayload<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

interface ErrorPayload {
  success: false;
  message: string;
  error: Record<string, unknown> | null;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
  ): Response<SuccessPayload<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    error: Record<string, unknown> | null = null
  ): Response<ErrorPayload> {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Generic application error that carries an HTTP status code.
 * Thrown from services/repositories and caught by the global error handler.
 */
export class AppError extends Error {
  public statusCode: number;
  public details: Record<string, unknown> | null;

  constructor(
    message: string,
    statusCode = 500,
    details: Record<string, unknown> | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
