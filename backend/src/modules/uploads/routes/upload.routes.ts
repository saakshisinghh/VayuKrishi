import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import {
  imageUpload,
  audioUpload,
  documentUpload,
  handleMulterError,
} from '../../../middleware/upload.middleware';
import {
  validateUploadBody,
  validateGetFilesQuery,
  validateMongoId,
} from '../validators/upload.validator';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// =============================================
// UPLOAD ROUTES
// =============================================

/**
 * @route   POST /api/v1/uploads/image
 * @desc    Upload an image (disease, profile, general)
 * @access  Private
 * @body    FormData: image (file), farmId? (string), category? (string)
 */
router.post(
  '/image',
  (req, res, next) => {
    imageUpload(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  validateUploadBody,
  uploadController.uploadImage.bind(uploadController)
);

/**
 * @route   POST /api/v1/uploads/audio
 * @desc    Upload an audio recording (voice assistant input)
 * @access  Private
 * @body    FormData: audio (file), farmId? (string), category? (string)
 */
router.post(
  '/audio',
  (req, res, next) => {
    audioUpload(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  validateUploadBody,
  uploadController.uploadAudio.bind(uploadController)
);

/**
 * @route   POST /api/v1/uploads/document
 * @desc    Upload a document (farm report, PDF, doc)
 * @access  Private
 * @body    FormData: document (file), farmId? (string), category? (string)
 */
router.post(
  '/document',
  (req, res, next) => {
    documentUpload(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  validateUploadBody,
  uploadController.uploadDocument.bind(uploadController)
);

/**
 * @route   GET /api/v1/uploads/my-files
 * @desc    Get all files uploaded by the authenticated user
 * @access  Private
 * @query   page, limit, category, resourceType
 */
router.get(
  '/my-files',
  validateGetFilesQuery,
  uploadController.getMyFiles.bind(uploadController)
);

/**
 * @route   GET /api/v1/uploads/:id
 * @desc    Get file metadata by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateMongoId('id'),
  uploadController.getFileById.bind(uploadController)
);

/**
 * @route   DELETE /api/v1/uploads/:id
 * @desc    Delete a file (owner or admin only)
 * @access  Private
 */
router.delete(
  '/:id',
  validateMongoId('id'),
  uploadController.deleteFile.bind(uploadController)
);

export default router;
