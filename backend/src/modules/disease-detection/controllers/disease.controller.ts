import { Request, Response, NextFunction } from 'express';
import { diseaseService, NotFoundError, ForbiddenError, BadRequestError } from '../services/disease.service';
import { DetectDiseaseBody, GetHistoryQuery }  from '../validators/disease.validator';
import { AuthUser } from '../types/disease.types';
import { ApiSuccess, ApiError } from '../types/disease.types';

// ─── Response helpers ─────────────────────────────────────────────────────────

function success<T>(res: Response, data: T, message: string, statusCode = 200): Response {
  const body: ApiSuccess<T> = {
    success:   true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

function errorResponse(
  res: Response,
  message: string,
  error: Record<string, unknown>,
  statusCode: number,
): Response {
  const body: ApiError = {
    success:   false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

function mapError(err: unknown): { message: string; detail: Record<string, unknown>; status: number } {
  if (err instanceof NotFoundError)       return { message: err.message, detail: { type: err.name }, status: 404 };
  if (err instanceof ForbiddenError)      return { message: err.message, detail: { type: err.name }, status: 403 };
  if (err instanceof BadRequestError)     return { message: err.message, detail: { type: err.name }, status: 400 };
  if (err instanceof Error)               return { message: err.message, detail: { type: 'InternalError' }, status: 500 };
  return { message: 'An unexpected error occurred', detail: {}, status: 500 };
}

// ─── Controller ───────────────────────────────────────────────────────────────

export class DiseaseController {

  // POST /api/v1/disease/detect
  async detect(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const body  = req.body as DetectDiseaseBody;
      const user  = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;

      const report = await diseaseService.detectDisease(body, user);

      success(res, report, 'Disease detection completed.', 201);
    } catch (err) {
      const { message, detail, status } = mapError(err);
      errorResponse(res, message, detail, status);
    }
  }

  // GET /api/v1/disease/history
  async getHistory(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetHistoryQuery;
      const user  = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;

      const result = await diseaseService.getHistory(query, user);

      success(res, result, 'Disease history retrieved successfully.');
    } catch (err) {
      const { message, detail, status } = mapError(err);
      errorResponse(res, message, detail, status);
    }
  }

  // GET /api/v1/disease/history/:id
  async getById(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;

      const report = await diseaseService.getDiseaseReportById(id, user);

      success(res, report, 'Disease report retrieved successfully.');
    } catch (err) {
      const { message, detail, status } = mapError(err);
      errorResponse(res, message, detail, status);
    }
  }

  // PATCH /api/v1/disease/verify/:id
  async verify(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;

      const report = await diseaseService.verifyReport(id, user);

      success(res, report, 'Disease report verified successfully.');
    } catch (err) {
      const { message, detail, status } = mapError(err);
      errorResponse(res, message, detail, status);
    }
  }

  // DELETE /api/v1/disease/history/:id
  async deleteReport(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user   = { ...req.user, _id: req.user?.userId, userId: req.user?.userId } as unknown as AuthUser;

      await diseaseService.deleteReport(id, user);

      success(res, null, 'Disease report deleted successfully.');
    } catch (err) {
      const { message, detail, status } = mapError(err);
      errorResponse(res, message, detail, status);
    }
  }
}

export const diseaseController = new DiseaseController();
