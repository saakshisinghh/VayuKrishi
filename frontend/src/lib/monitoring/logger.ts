type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDev = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (this.isDev) {
      const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
      fn(`[Vayukrishi][${level.toUpperCase()}]`, message, context ?? "");
    }

    // In production, pipe to external service (Sentry, PostHog, etc.)
    if (!this.isDev && level === "error" && typeof window !== "undefined") {
      // window.__sentry?.captureException(new Error(message));
    }
  }

  debug(message: string, context?: LogContext) { this.log("debug", message, context); }
  info(message: string, context?: LogContext) { this.log("info", message, context); }
  warn(message: string, context?: LogContext) { this.log("warn", message, context); }
  error(message: string, context?: LogContext) { this.log("error", message, context); }
}

export const logger = new Logger();
