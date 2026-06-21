/**
 * modules/users/controllers/user.controller.ts
 * -----------------------------------------------
 * HTTP layer for the users module. Thin: validates req.user exists
 * (guaranteed by `authenticate` middleware running first), delegates
 * to userService, and sends the standard success response shape.
 */

import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../../../shared/utils/async-handler';
import { sendSuccess } from '../../../shared/utils/api-response';
import { ApiError } from '../../../shared/utils/api-error';
import { UpdateProfileInput } from '../validators/user.validator';

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const body = req.body as UpdateProfileInput;
  const profile = await userService.updateProfile(req.user.userId, body);

  sendSuccess(res, profile, 'Profile updated successfully');
});
