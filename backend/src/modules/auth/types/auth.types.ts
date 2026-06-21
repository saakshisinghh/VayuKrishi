/**
 * modules/auth/types/auth.types.ts
 * --------------------------------------
 * Shared interfaces for the auth module's service/controller layers.
 * Mirrors the frontend's `src/types/auth.ts` contract exactly: mobile +
 * password + OTP, profile fields nested under `profile`, refresh token
 * delivered via httpOnly cookie (never present in any JSON response).
 */

import { UserRole, Language, SoilType, OTPPurpose } from '../../../shared/enums/user.enums';

export interface RegisterDto {
  name: string;
  mobile: string;
  language: Language;
  state: string;
  district: string;
  village?: string;
  landSizeAcres?: number;
  soilType?: SoilType;
  password: string;
}

export interface LoginDto {
  mobile: string;
  password: string;
}

export interface OtpSendDto {
  mobile: string;
  purpose: OTPPurpose;
}

export interface OtpVerifyDto {
  mobile: string;
  otp: string;
  purpose: OTPPurpose;
}

export interface ForgotPasswordDto {
  mobile: string;
}

export interface ResetPasswordDto {
  mobile: string;
  otp: string;
  newPassword: string;
}

export interface AuthUserProfileView {
  state: string;
  district: string;
  village?: string;
  pincode?: string;
  landSizeAcres?: number;
  soilType?: SoilType;
  primaryCrops?: string[];
}

export interface AuthUserView {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  language: Language;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: AuthUserProfileView;
}

/** What login/refresh/otp-verify-with-login return: access token only — refresh token is set as an httpOnly cookie, never returned in JSON. */
export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: AuthUserView;
  tokens: AuthTokens;
}
