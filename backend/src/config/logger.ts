import winston from 'winston';
import { env, isProduction } from './env';

/**
 * logger.ts
 * ---------
 * Centralized Winston logger.
 * - In development: human-readable, colorized console output.
 * - In production: structured JSON output (suitable for log aggregators
 *   like CloudWatch, Datadog, ELK, etc).
 */

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts}] ${level}: ${stack || message}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: isProduction ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

/**
 * Stream adapter so Morgan (HTTP request logging) can pipe through Winston
 * instead of writing directly to stdout.
 */
export const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};
