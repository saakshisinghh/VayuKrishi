import { Request, Response, NextFunction } from 'express';
import { FarmService } from '../services/farm.service';
import { CreateFarmDto, UpdateFarmDto, FarmQueryParams } from '../types/farm.types';
import { sendSuccess } from '../../../utils/response';
import { HTTP_STATUS } from '../../../constants/httpStatus';
import { SoilType } from '../farm.model';

export class FarmController {
  private readonly farmService: FarmService;

  constructor() {
    this.farmService = new FarmService();
  }

  // ─── POST /farms ──────────────────────────────────────────────────────────

  createFarm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const dto = req.body as CreateFarmDto;

      const farm = await this.farmService.createFarm(userId, dto);

      sendSuccess(res, HTTP_STATUS.CREATED, 'Farm created successfully', farm);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /farms ───────────────────────────────────────────────────────────

  getUserFarms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;

      const query: FarmQueryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string | undefined,
        district: req.query.district as string | undefined,
        state: req.query.state as string | undefined,
        soilType: req.query.soilType as SoilType | undefined,
        sortBy: (req.query.sortBy as 'createdAt' | 'name') ?? 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') ?? 'desc',
      };

      const result = await this.farmService.getUserFarms(userId, query);

      sendSuccess(res, HTTP_STATUS.OK, 'Farms retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /farms/:id ───────────────────────────────────────────────────────

  getFarmById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;

      const farm = await this.farmService.getFarmById(id, requesterId, requesterRole);

      sendSuccess(res, HTTP_STATUS.OK, 'Farm retrieved successfully', farm);
    } catch (err) {
      next(err);
    }
  };

  // ─── PATCH /farms/:id ────────────────────────────────────────────────────

  updateFarm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;
      const dto = req.body as UpdateFarmDto;

      const updated = await this.farmService.updateFarm(
        id,
        dto,
        requesterId,
        requesterRole
      );

      sendSuccess(res, HTTP_STATUS.OK, 'Farm updated successfully', updated);
    } catch (err) {
      next(err);
    }
  };

  // ─── DELETE /farms/:id ───────────────────────────────────────────────────

  deleteFarm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;

      await this.farmService.deleteFarm(id, requesterId, requesterRole);

      sendSuccess(res, HTTP_STATUS.OK, 'Farm deactivated successfully', null);
    } catch (err) {
      next(err);
    }
  };
}
