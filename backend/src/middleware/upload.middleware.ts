import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request, RequestHandler } from 'express';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_AUDIO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  FILE_SIZE_LIMITS,
} from '../modules/uploads/types/upload.types';
import { FileTypeError, FileSizeError } from '../utils/AppError';

// =============================================
// MEMORY STORAGE (files stay in RAM as Buffer)
// =============================================

const memoryStorage: StorageEngine = multer.memoryStorage();

// =============================================
// FILE FILTER FACTORIES
// =============================================

const createFileFilter = (
  allowedTypes: readonly string[]
): ((req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void) => {
  return (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new FileTypeError(
          `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`
        )
      );
    }
  };
};

// =============================================
// MULTER INSTANCES
// =============================================

export const imageUpload: RequestHandler = multer({
  storage: memoryStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.IMAGE,
    files: 1,
  },
  fileFilter: createFileFilter([...ALLOWED_IMAGE_TYPES]),
}).single('image');

export const audioUpload: RequestHandler = multer({
  storage: memoryStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.AUDIO,
    files: 1,
  },
  fileFilter: createFileFilter([...ALLOWED_AUDIO_TYPES]),
}).single('audio');

export const documentUpload: RequestHandler = multer({
  storage: memoryStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCUMENT,
    files: 1,
  },
  fileFilter: createFileFilter([...ALLOWED_DOCUMENT_TYPES]),
}).single('document');

// =============================================
// MULTER ERROR HANDLER MIDDLEWARE
// =============================================

import { Response, NextFunction } from 'express';

export const handleMulterError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        success: false,
        message: 'File size exceeds the allowed limit',
        error: { code: err.code, field: err.field },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({
        success: false,
        message: `Unexpected file field: ${err.field}`,
        error: { code: err.code, field: err.field },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      error: { code: err.code },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (err instanceof FileTypeError || err instanceof FileSizeError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next(err);
};
