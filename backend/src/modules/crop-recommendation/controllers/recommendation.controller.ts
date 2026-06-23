import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import {
  CreateRecommendationDto,
  RecommendationHistoryQuery,
} from '../types/recommendation.types';
import { Season } from '../recommendation.model';
import { sendSuccess } from '../../../utils/response';
import { HTTP_STATUS } from '../../../constants/httpStatus';

export class RecommendationController {
  private readonly service: RecommendationService;

  constructor() {
    this.service = new RecommendationService();
  }

  // ─── POST /crop/recommend ─────────────────────────────────────────────────

  createRecommendation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const dto = req.body as CreateRecommendationDto;

      const recommendation = await this.service.createRecommendation(userId, dto);

      sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        'Crop recommendations generated successfully',
        { recommendation }
      );
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /crop/history ────────────────────────────────────────────────────

  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;

      const query: RecommendationHistoryQuery = {
        page:      req.query.page      ? Number(req.query.page)  : 1,
        limit:     req.query.limit     ? Number(req.query.limit) : 10,
        season:    req.query.season    as Season | undefined,
        year:      req.query.year      ? Number(req.query.year)  : undefined,
        sortOrder: (req.query.sortOrder as 'newest' | 'oldest') ?? 'newest',
      };

      const result = await this.service.getHistory(userId, query);

      sendSuccess(
        res,
        HTTP_STATUS.OK,
        'Recommendation history retrieved successfully',
        result
      );
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /crop/history/:id ────────────────────────────────────────────────

  getRecommendationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id }          = req.params;
      const requesterId     = req.user!.userId;
      const requesterRole   = req.user!.role;

      const recommendation = await this.service.getRecommendationById(
        id,
        requesterId,
        requesterRole
      );

      sendSuccess(
        res,
        HTTP_STATUS.OK,
        'Recommendation retrieved successfully',
        { recommendation }
      );
    } catch (err) {
      next(err);
    }
  };

  // ─── DELETE /crop/history/:id ─────────────────────────────────────────────

  deleteRecommendation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id }        = req.params;
      const requesterId   = req.user!.userId;
      const requesterRole = req.user!.role;

      await this.service.deleteRecommendation(id, requesterId, requesterRole);

      sendSuccess(
        res,
        HTTP_STATUS.OK,
        'Recommendation deleted successfully',
        null
      );
    } catch (err) {
      next(err);
    }
  };
}
