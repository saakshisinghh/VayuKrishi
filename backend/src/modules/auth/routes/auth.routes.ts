/**
 * modules/auth/routes/auth.routes.ts
 * ------------------------------------------
 * All routes here are mounted under /api/v1/auth (see routes/index.ts).
 * authLimiter is applied to every unauthenticated, abuse-prone endpoint
 * (register, login, otp send/verify, forgot/reset password, refresh).
 */

import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validation.middleware';
import { authLimiter } from '../../../middleware/rate-limit.middleware';
import {
  registerSchema,
  loginSchema,
  otpSendSchema,
  otpVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  me,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/otp/send', authLimiter, validate(otpSendSchema), sendOtp);
router.post('/otp/verify', authLimiter, validate(otpVerifySchema), verifyOtp);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
