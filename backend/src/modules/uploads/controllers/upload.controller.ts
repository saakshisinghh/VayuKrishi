import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { sendSuccess, sendError } from '../../../utils/response';
import {
  UploadCategory,
  ResourceType,
  IGetUserFilesDto,
} from '../types/upload.types';
import { AuthenticationError } from '../../../utils/AppError';

// =============================================
// UPLOAD CONTROLLER
// =============================================

export class UploadController {
  // ──────────────────────────────────────────
  // POST /uploads/image
  // ──────────────────────────────────────────
  async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      if (!req.file) {
        sendError(res, 400, 'No image file provided. Use multipart/form-data with field name "image".');
        return;
      }

      const { farmId, category } = req.body;

      const media = await uploadService.uploadImage(
        req.file,
        req.user.userId,
        farmId,
        category as UploadCategory
      );

      sendSuccess(res, 201, 'Image uploaded successfully', media);
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────
  // POST /uploads/audio
  // ──────────────────────────────────────────
  async uploadAudio(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      if (!req.file) {
        sendError(res, 400, 'No audio file provided. Use multipart/form-data with field name "audio".');
        return;
      }

      const { farmId, category } = req.body;

      const media = await uploadService.uploadAudio(
        req.file,
        req.user.userId,
        farmId,
        category as UploadCategory
      );

      sendSuccess(res, 201, 'Audio uploaded successfully', media);
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────
  // POST /uploads/document
  // ──────────────────────────────────────────
  async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      if (!req.file) {
        sendError(res, 400, 'No document file provided. Use multipart/form-data with field name "document".');
        return;
      }

      const { farmId, category } = req.body;

      const media = await uploadService.uploadDocument(
        req.file,
        req.user.userId,
        farmId,
        category as UploadCategory
      );

      sendSuccess(res, 201, 'Document uploaded successfully', media);
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────
  // GET /uploads/my-files
  // ──────────────────────────────────────────
  async getMyFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      const dto: IGetUserFilesDto = {
        userId: req.user.userId,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        category: req.query.category as UploadCategory | undefined,
        resourceType: req.query.resourceType as ResourceType | undefined,
      };

      const { files, pagination } = await uploadService.getUserFiles(dto);

      sendSuccess(res, 200, 'Files retrieved', { files, pagination });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────
  // GET /uploads/:id
  // ──────────────────────────────────────────
  async getFileById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      const media = await uploadService.getFileById(req.params.id);

      sendSuccess(res, 200, 'File retrieved successfully', media);
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────
  // DELETE /uploads/:id
  // ──────────────────────────────────────────
  async deleteFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError();

      await uploadService.deleteFile(
        req.params.id,
        req.user.userId,
        req.user.role
      );

      sendSuccess(res, 200, 'File deleted successfully',null);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
