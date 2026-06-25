import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

/**
 * Generic validate-and-assign middleware. Parses `req[source]` against
 * the given Zod schema, replaces it with the parsed (and type-coerced)
 * result, and forwards ZodErrors to the global error handler.
 */
export const validate =
  (schema: ZodSchema, source: Source = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      
      req[source] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
