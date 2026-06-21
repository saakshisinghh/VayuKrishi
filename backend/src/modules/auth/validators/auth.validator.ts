/**
 * modules/auth/validators/auth.validator.ts
 * -------------------------------------------------
 * Zod schemas for the auth endpoints, matching the frontend's mobile +
 * OTP contract.
 */

import { z } from 'zod';
import { Language, SoilType, OTPPurpose } from '../../../shared/enums/user.enums';

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{10,15}$/, 'Mobile number must be 10-15 digits');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  mobile: mobileSchema,
  language: z.nativeEnum(Language).optional().default(Language.EN),
  state: z.string().trim().min(1, 'State is required'),
  district: z.string().trim().min(1, 'District is required'),
  village: z.string().trim().optional(),
  landSizeAcres: z.coerce.number().min(0).optional(),
  soilType: z.nativeEnum(SoilType).optional(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  mobile: mobileSchema,
  password: z.string().min(1, 'Password is required'),
});

export const otpSendSchema = z.object({
  mobile: mobileSchema,
  purpose: z.nativeEnum(OTPPurpose),
});

export const otpVerifySchema = z.object({
  mobile: mobileSchema,
  otp: z.string().trim().min(4).max(8),
  purpose: z.nativeEnum(OTPPurpose),
});

export const forgotPasswordSchema = z.object({
  mobile: mobileSchema,
});

export const resetPasswordSchema = z.object({
  mobile: mobileSchema,
  otp: z.string().trim().min(4).max(8),
  newPassword: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpSendInput = z.infer<typeof otpSendSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
