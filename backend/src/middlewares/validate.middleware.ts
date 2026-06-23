import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Generic Zod validation middleware.
 *
 * Validates req.body, req.params, and req.query against the provided schema.
 * On failure it returns a 422 with the Zod error details.
 *
 * Usage:
 *   router.post('/', validate(createFarmSchema), controller.create)
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Replace with parsed (and potentially transformed) values
      req.body = parsed.body ?? req.body;
      req.params = parsed.params ?? req.params;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).query = parsed.query ?? req.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          'Validation failed',
          errors
        );
        return;
      }

      next(err);
    }
  };
