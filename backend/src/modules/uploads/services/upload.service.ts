import { v4 as uuidv4 } from 'uuid';
import {
  ResourceType,
  UploadCategory,
  CloudinaryFolder,
  ICreateMediaDto,
  IGetUserFilesDto,
} from '../types/upload.types';
import { IMediaDocument } from '../media.model';
import { mediaRepository } from '../repositories/media.repository';
import { IPaginatedResult } from '../repositories/media.repository';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCategoryFolder,
  sanitizeFileName,
} from '../../../utils/cloudinaryUpload';
import { PaginationMeta } from '../../../utils/response';
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
} from '../../../utils/AppError';
import { logger } from '../../../config/logger';

// =============================================
// UPLOAD SERVICE
// =============================================

export class UploadService {
  // ──────────────────────────────────────────
  // Upload Image
  // ──────────────────────────────────────────
  async uploadImage(
    file: Express.Multer.File,
    userId: string,
    farmId?: string,
    category: UploadCategory = UploadCategory.DISEASE
  ): Promise<IMediaDocument> {
    if (!file) throw new ValidationError('No image file provided');

    const folder = getCategoryFolder(category);
    const sanitized = sanitizeFileName(file.originalname);
    const publicIdBase = `${uuidv4()}_${sanitized.replace(/\.[^.]+$/, '')}`;

    logger.debug(`Uploading image to Cloudinary: ${folder}/${publicIdBase}`);

    const uploadResult = await uploadToCloudinary(file.buffer, {
      folder,
      publicId: publicIdBase,
      resourceType: 'image',
    });

    const dto: ICreateMediaDto = {
      userId,
      farmId,
      fileName: sanitized,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: ResourceType.IMAGE,
      category,
    };

    const media = await mediaRepository.create(dto);
    logger.info(`Image uploaded successfully: ${media._id}`);
    return media;
  }

  // ──────────────────────────────────────────
  // Upload Audio
  // ──────────────────────────────────────────
  async uploadAudio(
    file: Express.Multer.File,
    userId: string,
    farmId?: string,
    category: UploadCategory = UploadCategory.VOICE
  ): Promise<IMediaDocument> {
    if (!file) throw new ValidationError('No audio file provided');

    const folder = CloudinaryFolder.VOICE_RECORDINGS;
    const sanitized = sanitizeFileName(file.originalname);
    const publicIdBase = `${uuidv4()}_${sanitized.replace(/\.[^.]+$/, '')}`;

    logger.debug(`Uploading audio to Cloudinary: ${folder}/${publicIdBase}`);

    // Cloudinary uses 'video' resource_type for audio files
    const uploadResult = await uploadToCloudinary(file.buffer, {
      folder,
      publicId: publicIdBase,
      resourceType: 'video',
    });

    const dto: ICreateMediaDto = {
      userId,
      farmId,
      fileName: sanitized,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: ResourceType.AUDIO,
      category: UploadCategory.VOICE,
    };

    const media = await mediaRepository.create(dto);
    logger.info(`Audio uploaded successfully: ${media._id}`);
    return media;
  }

  // ──────────────────────────────────────────
  // Upload Document
  // ──────────────────────────────────────────
  async uploadDocument(
    file: Express.Multer.File,
    userId: string,
    farmId?: string,
    category: UploadCategory = UploadCategory.FARM_DOCUMENT
  ): Promise<IMediaDocument> {
    if (!file) throw new ValidationError('No document file provided');

    const folder =
      category === UploadCategory.REPORT
        ? CloudinaryFolder.REPORTS
        : CloudinaryFolder.FARM_DOCUMENTS;

    const sanitized = sanitizeFileName(file.originalname);
    const publicIdBase = `${uuidv4()}_${sanitized.replace(/\.[^.]+$/, '')}`;

    logger.debug(`Uploading document to Cloudinary: ${folder}/${publicIdBase}`);

    // Cloudinary uses 'raw' resource_type for documents
    const uploadResult = await uploadToCloudinary(file.buffer, {
      folder,
      publicId: publicIdBase,
      resourceType: 'raw',
    });

    const dto: ICreateMediaDto = {
      userId,
      farmId,
      fileName: sanitized,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: ResourceType.DOCUMENT,
      category,
    };

    const media = await mediaRepository.create(dto);
    logger.info(`Document uploaded successfully: ${media._id}`);
    return media;
  }

  // ──────────────────────────────────────────
  // Get User Files (paginated)
  // ──────────────────────────────────────────
  async getUserFiles(
    dto: IGetUserFilesDto
  ): Promise<{ files: IMediaDocument[]; pagination: PaginationMeta }> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const result: IPaginatedResult<IMediaDocument> =
      await mediaRepository.findByUser({
        userId: dto.userId,
        page,
        limit,
        category: dto.category,
        resourceType: dto.resourceType,
      });

    const pagination: PaginationMeta = {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNextPage: result.page < result.totalPages,
      hasPrevPage: result.page > 1,
    };

    return { files: result.data, pagination };
  }

  // ──────────────────────────────────────────
  // Get File By ID
  // ──────────────────────────────────────────
  async getFileById(id: string): Promise<IMediaDocument> {
    const media = await mediaRepository.findById(id);
    if (!media) throw new NotFoundError(`Media file not found: ${id}`);
    return media;
  }

  // ──────────────────────────────────────────
  // Delete File
  // ──────────────────────────────────────────
  async deleteFile(
    id: string,
    requestingUserId: string,
    requestingUserRole: string
  ): Promise<void> {
    const media = await mediaRepository.findById(id);
    if (!media) throw new NotFoundError(`Media file not found: ${id}`);

    // Only owner or admin can delete
    const isOwner = media.userId.toString() === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AuthorizationError(
        'You do not have permission to delete this file'
      );
    }

    // 1. Delete from Cloudinary
    await deleteFromCloudinary(media.publicId, media.resourceType);

    // 2. Delete metadata from MongoDB
    await mediaRepository.delete(id);

    logger.info(`File deleted: ${id} by user: ${requestingUserId}`);
  }
}

export const uploadService = new UploadService();
