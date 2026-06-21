/**
 * modules/auth/controllers/auth.controller.ts
 * -----------------------------------------------
 * Thin HTTP layer mapping each auth route to a service call. The refresh
 * token NEVER appears in a JSON response — it's set/read/cleared as an
 * httpOnly cookie here, right at the HTTP boundary, so the service layer
 * never has to think about cookies at all.
 */

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../../../shared/utils/async-handler';
import { sendSuccess } from '../../../shared/utils/api-response';
import { ApiError } from '../../../shared/utils/api-error';
import {
  RegisterInput,
  LoginInput,
  OtpSendInput,
  OtpVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validators/auth.validator';
import { HttpStatus } from '../../../shared/constants/http-status';
import { setRefreshTokenCookie, clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE } from '../../../shared/helpers/cookie.helper';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterInput;
  const result = await authService.register(body);
  sendSuccess(res, result, 'OTP sent successfully', HttpStatus.CREATED);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginInput;
  const { refreshToken, user, tokens } = await authService.login(body);
  setRefreshTokenCookie(res, refreshToken);
  sendSuccess(res, { user, accessToken: tokens.accessToken, expiresIn: tokens.expiresIn }, 'Login successful');
});

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as OtpSendInput;
  const result = await authService.sendOtp(body.mobile, body.purpose);
  sendSuccess(res, result, result.message);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as OtpVerifyInput;
  const { message, result } = await authService.verifyOtp(body);

  if (result) {
    const { refreshToken, ...rest } = result;
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user: rest.user, accessToken: rest.tokens.accessToken, expiresIn: rest.tokens.expiresIn, message }, message);
    return;
  }

  sendSuccess(res, { message }, message);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as ForgotPasswordInput;
  const result = await authService.forgotPassword(body.mobile);
  sendSuccess(res, result, result.message);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as ResetPasswordInput;
  const result = await authService.resetPassword(body);
  sendSuccess(res, result, result.message);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
  if (!token) {
    throw ApiError.unauthorized('No refresh token provided');
  }
  const result = await authService.refresh(token);
  sendSuccess(res, result, 'Access token refreshed');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  await authService.logout(req.user.userId);
  clearRefreshTokenCookie(res);
  sendSuccess(res, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  const user = await authService.getCurrentUser(req.user.userId);
  sendSuccess(res, user, 'Current user fetched successfully');
});
