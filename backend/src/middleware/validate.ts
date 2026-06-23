import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * validate
 *
 * Generic Zod validation middleware.
 * Validates req.body, req.query, req.params based on the shape of the schema.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body:   req.body,
      query:  req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field:   e.path.join('.'),
        message: e.message,
      }));

      res.status(422).json({
        success:   false,
        message:   'Validation failed',
        error:     { validationErrors: errors },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Overwrite req properties with parsed (coerced + stripped) values
    if (result.data.body)   req.body   = result.data.body;
    if (result.data.query)  req.query  = result.data.query;
    if (result.data.params) req.params = result.data.params;

    next();
  };
}
