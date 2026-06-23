import { Types } from 'mongoose';
import { Media, IMediaDocument } from '../media.model';
import {
  ICreateMediaDto,
  IGetUserFilesDto,
  ResourceType,
  UploadCategory,
} from '../types/upload.types';
import { logger } from '../../../config/logger';

// =============================================
// INTERFACES
// =============================================

export interface IFindByUserOptions {
  userId: string;
  page: number;
  limit: number;
  category?: UploadCategory;
  resourceType?: ResourceType;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================
// MEDIA REPOSITORY
// =============================================

export class MediaRepository {
  /**
   * Create a new media record
   */
  async create(dto: ICreateMediaDto): Promise<IMediaDocument> {
    try {
      const media = new Media({
        userId: new Types.ObjectId(dto.userId),
        farmId: dto.farmId ? new Types.ObjectId(dto.farmId) : null,
        fileName: dto.fileName,
        originalName: dto.originalName,
        mimeType: dto.mimeType,
        fileSize: dto.fileSize,
        fileUrl: dto.fileUrl,
        publicId: dto.publicId,
        resourceType: dto.resourceType,
        category: dto.category,
        uploadedAt: new Date(),
      });

      const saved = await media.save();
      logger.debug(`Media record created: ${saved._id}`);
      return saved;
    } catch (error) {
      logger.error('MediaRepository.create error:', error);
      throw error;
    }
  }

  /**
   * Find a media record by ID
   */
  async findById(id: string): Promise<IMediaDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) return null;
      return await Media.findById(id).exec();
    } catch (error) {
      logger.error('MediaRepository.findById error:', error);
      throw error;
    }
  }

  /**
   * Find all media records for a user with pagination and filters
   */
  async findByUser(
    options: IFindByUserOptions
  ): Promise<IPaginatedResult<IMediaDocument>> {
    try {
      const { userId, page, limit, category, resourceType } = options;

      const filter: Record<string, unknown> = {
        userId: new Types.ObjectId(userId),
      };

      if (category) filter.category = category;
      if (resourceType) filter.resourceType = resourceType;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Media.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Media.countDocuments(filter).exec(),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('MediaRepository.findByUser error:', error);
      throw error;
    }
  }

  /**
   * Find media by publicId (Cloudinary)
   */
  async findByPublicId(publicId: string): Promise<IMediaDocument | null> {
    try {
      return await Media.findOne({ publicId }).exec();
    } catch (error) {
      logger.error('MediaRepository.findByPublicId error:', error);
      throw error;
    }
  }

  /**
   * Delete a media record by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) return false;
      const result = await Media.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      logger.error('MediaRepository.delete error:', error);
      throw error;
    }
  }

  /**
   * Count total media records for a user
   */
  async countByUser(userId: string): Promise<number> {
    try {
      return await Media.countDocuments({
        userId: new Types.ObjectId(userId),
      }).exec();
    } catch (error) {
      logger.error('MediaRepository.countByUser error:', error);
      throw error;
    }
  }
}

export const mediaRepository = new MediaRepository();
