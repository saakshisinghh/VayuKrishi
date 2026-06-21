/**
 * middleware/validation.middleware.ts
 * ---------------------------------------
 * Generic middleware factory: pass it a Zod schema, get back an Express
 * middleware that validates req.body (or query/params) and replaces it
 * with the parsed (and therefore typed + coerced) result.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../shared/utils/api-error';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = result.error.flatten().fieldErrors;
      next(ApiError.badRequest('Validation failed', details));
      return;
    }

    req[target] = result.data;
    next();
  };
}
