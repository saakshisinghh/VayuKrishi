import { AppError, NotFoundError, ValidationError } from "./AppError";

/**
 * Shim: maps phase-7 ApiError static helpers → your existing AppError classes.
 */
export class ApiError extends AppError {
  static notFound(message = "Resource not found") {
    return new NotFoundError(message);
  }
  static badRequest(message: string) {
    return new ValidationError(message);
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401);
  }
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }
  static internal(message = "Internal server error") {
    return new AppError(message, 500);
  }
}
