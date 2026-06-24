import { Request, Response, NextFunction } from 'express';
import { schemeService, NotFoundError, ForbiddenError, ConflictError, BadRequestError } from '../services/scheme.service';
import { AuthUser } from '../types/scheme.types';

// ─── Response helpers ─────────────────────────────────────────────────────────

function ok<T>(res: Response, data: T, message: string, code = 200): void {
  res.status(code).json({ success: true, message, data, timestamp: new Date().toISOString() });
}

function fail(res: Response, message: string, error: Record<string, unknown>, code: number): void {
  res.status(code).json({ success: false, message, error, timestamp: new Date().toISOString() });
}

function mapErr(err: unknown): { msg: string; detail: Record<string, unknown>; code: number } {
  if (err instanceof NotFoundError)   return { msg: err.message, detail: { type: err.name }, code: 404 };
  if (err instanceof ForbiddenError)  return { msg: err.message, detail: { type: err.name }, code: 403 };
  if (err instanceof ConflictError)   return { msg: err.message, detail: { type: err.name }, code: 409 };
  if (err instanceof BadRequestError) return { msg: err.message, detail: { type: err.name }, code: 400 };
  if (err instanceof Error)           return { msg: err.message, detail: { type: 'InternalError' }, code: 500 };
  return { msg: 'Unexpected error', detail: {}, code: 500 };
}

// ─── Controller ───────────────────────────────────────────────────────────────

export class SchemeController {

  // GET /api/v1/schemes
  async list(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const result = await schemeService.getSchemes(req.query as never);
      ok(res, result, 'Schemes retrieved successfully.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // GET /api/v1/schemes/search
  async search(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const result = await schemeService.searchSchemes(req.query as never);
      ok(res, result, 'Search completed.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // GET /api/v1/schemes/:id
  async getById(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const scheme = await schemeService.getSchemeById(req.params.id);
      ok(res, scheme, 'Scheme retrieved successfully.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // POST /api/v1/schemes/check-eligibility
  async checkEligibility(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.checkEligibility(req.body as never, user);
      ok(res, result, 'Eligibility check completed.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // POST /api/v1/schemes/apply
  async apply(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.applyForScheme(req.body as never, user);
      ok(res, result, 'Application submitted successfully.', 201);
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // GET /api/v1/schemes/my-applications
  async myApplications(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.getApplications(req.query as never, user);
      ok(res, result, 'Applications retrieved successfully.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // GET /api/v1/schemes/applications/:id
  async getApplication(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.getApplicationById(req.params.id, user);
      ok(res, result, 'Application retrieved successfully.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // PATCH /api/v1/schemes/applications/:id/status
  async updateStatus(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.updateApplicationStatus(req.params.id, req.body as never, user);
      ok(res, result, 'Application status updated.');
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }

  // POST /api/v1/schemes/sync
  async sync(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;
      const result = await schemeService.syncSchemes(user);
      ok(res, result, `Sync complete. Upserted: ${result.upserted}, Modified: ${result.modified}.`);
    } catch (err) {
      const e = mapErr(err);
      fail(res, e.msg, e.detail, e.code);
    }
  }
}

export const schemeController = new SchemeController();
