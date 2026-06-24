import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

/**
 * Validates a given request part against a Zod schema.
 * On success, replaces req[part] with the parsed (and type-coerced) data.
 * On failure, throws a ZodError which is handled by the global error handler.
 */
export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[part]);
    (req as unknown as Record<RequestPart, unknown>)[part] = parsed;
    next();
  };
}
