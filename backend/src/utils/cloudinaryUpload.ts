import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary';
import {
  ResourceType,
  CloudinaryFolder,
  UploadCategory,
} from '../modules/uploads/types/upload.types';
import { logger } from '../config/logger';

export interface CloudinaryUploadOptions {
  folder: CloudinaryFolder;
  publicId?: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
}

export const uploadToCloudinary = (
  buffer: Buffer,
  options: CloudinaryUploadOptions
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder: options.folder,
      resource_type: options.resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (options.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned no result'));
        }
        resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: ResourceType
): Promise<void> => {
  try {
    const cloudinaryResourceType =
      resourceType === ResourceType.AUDIO
        ? 'video'
        : resourceType === ResourceType.DOCUMENT
        ? 'raw'
        : 'image';

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: cloudinaryResourceType,
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    logger.debug(`Cloudinary asset deleted: ${publicId}`);
  } catch (error) {
    logger.error('deleteFromCloudinary error:', error);
    throw error;
  }
};

export const getCategoryFolder = (category: UploadCategory): CloudinaryFolder => {
  const folderMap: Record<UploadCategory, CloudinaryFolder> = {
    [UploadCategory.PROFILE]: CloudinaryFolder.PROFILE_IMAGES,
    [UploadCategory.DISEASE]: CloudinaryFolder.DISEASE_IMAGES,
    [UploadCategory.VOICE]: CloudinaryFolder.VOICE_RECORDINGS,
    [UploadCategory.REPORT]: CloudinaryFolder.REPORTS,
    [UploadCategory.FARM_DOCUMENT]: CloudinaryFolder.FARM_DOCUMENTS,
    [UploadCategory.GENERAL]: CloudinaryFolder.GENERAL,
  };
  return folderMap[category] ?? CloudinaryFolder.GENERAL;
};

export const sanitizeFileName = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
    .substring(0, 100);
};
