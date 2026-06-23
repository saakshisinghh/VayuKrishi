/**
 * Custom operational error class.
 * Wraps HTTP status code alongside the message so error-handling
 * middleware can respond with the correct status without logic leaking
 * into controllers.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Restore prototype chain (required when extending built-in Error in TS)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class FileSizeError extends AppError {
  constructor(message: string) { super(message, 413); }
}
export class FileTypeError extends AppError {
  constructor(message: string) { super(message, 415); }
}
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') { super(message, 401); }
}


export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') { super(message, 404); }
}
export class AuthorizationError extends AppError {
  constructor(message: string = 'You are not authorized') { super(message, 403); }
}
export class ValidationError extends AppError {
  constructor(message: string) { super(message, 400); }
}

