import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { UploadCategory, ResourceType } from '../types/upload.types';
import { sendError } from '../../../utils/response';

// =============================================
// SCHEMAS
// =============================================

const uploadBodySchema = Joi.object({
  farmId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .optional()
    .messages({ 'string.pattern.base': 'farmId must be a valid MongoDB ObjectId' }),

  category: Joi.string()
    .valid(...Object.values(UploadCategory))
    .optional()
    .messages({
      'any.only': `category must be one of: ${Object.values(UploadCategory).join(', ')}`,
    }),
});

const getFilesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string()
    .valid(...Object.values(UploadCategory))
    .optional(),
  resourceType: Joi.string()
    .valid(...Object.values(ResourceType))
    .optional(),
});

const mongoIdSchema = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
    'any.required': 'ID is required',
  });

// =============================================
// VALIDATOR MIDDLEWARE
// =============================================

export const validateUploadBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = uploadBodySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    sendError(res, 400, message);
    return;
  }

  req.body = value;
  next();
};

export const validateGetFilesQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = getFilesQuerySchema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    sendError(res, 400, message);
    return;
  }

  req.query = value as Record<string, string>;
  next();
};

export const validateMongoId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = mongoIdSchema.validate(req.params[paramName]);

    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    next();
  };
};
