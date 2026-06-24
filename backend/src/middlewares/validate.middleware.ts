import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      (req as unknown as Record<RequestPart, unknown>)[part] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        err.errors.forEach((e) => {
          const key = e.path.join(".") || "value";
          if (!errors[key]) errors[key] = [];
          errors[key].push(e.message);
        });
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(err);
    }
  };
}