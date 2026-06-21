/**
 * middleware/request-logger.middleware.ts
 * ---------------------------------------------
 * Morgan HTTP request logger, configured to write through the Winston
 * logger (config/logger.ts) rather than directly to stdout, so all logs
 * share the same format/transport configuration.
 */

import morgan from 'morgan';
import { isProduction } from '../config/env';
import { morganStream } from '../config/logger';

const format = isProduction ? 'combined' : 'dev';

export const requestLogger = morgan(format, { stream: morganStream });
