// ─────────────────────────────────────────────────────────────────────────────
// src/lib/api/auth.ts
// Auth API endpoints — integrates with existing axios instance
//
// NOTE: every backend response is wrapped as
//   { success, data, message, timestamp }
// (confirmed directly from the network tab on /auth/login). These
// functions unwrap `.data` here, ONCE, so every caller (query hooks,
// components) works with the clean inner payload and never has to know
// about the envelope. If a caller needs `message`/`timestamp`, read
// them from the raw axios response instead — that's outside this file's
// job.
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "./axios";
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  OTPVerifyRequest,
  OTPVerifyResponseData,
  OTPSendRequest,
  OTPSendResponseData,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponseData,
  ApiEnvelope,
  User,
} from "@/types/auth";

// ─── Auth Endpoints ─────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Password-based login
 */
export async function loginApi(data: LoginRequest): Promise<LoginResponseData> {
  const response = await apiClient.post<ApiEnvelope<LoginResponseData>>(
    "/auth/login",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/register
 * New user registration — triggers OTP
 */
export async function registerApi(
  data: RegisterRequest
): Promise<RegisterResponseData> {
  const response = await apiClient.post<ApiEnvelope<RegisterResponseData>>(
    "/auth/register",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/otp/verify
 * Verify OTP for login, register, or forgot password
 */
export async function verifyOtpApi(
  data: OTPVerifyRequest
): Promise<OTPVerifyResponseData> {
  const response = await apiClient.post<ApiEnvelope<OTPVerifyResponseData>>(
    "/auth/otp/verify",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/otp/send
 * Send or resend OTP
 */
export async function sendOtpApi(data: OTPSendRequest): Promise<OTPSendResponseData> {
  const response = await apiClient.post<ApiEnvelope<OTPSendResponseData>>(
    "/auth/otp/send",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/forgot-password
 * Initiate forgot password flow
 */
export async function forgotPasswordApi(
  data: ForgotPasswordRequest
): Promise<OTPSendResponseData> {
  const response = await apiClient.post<ApiEnvelope<OTPSendResponseData>>(
    "/auth/forgot-password",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/reset-password
 * Reset password with OTP verification
 */
export async function resetPasswordApi(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponseData> {
  const response = await apiClient.post<ApiEnvelope<ResetPasswordResponseData>>(
    "/auth/reset-password",
    data
  );
  return response.data.data;
}

/**
 * POST /auth/refresh
 * Refresh access token using HTTP-only cookie
 */
export async function refreshTokenApi(): Promise<{
  accessToken: string;
  expiresIn: number;
  user: User;
}> {
  const response = await apiClient.post<
    ApiEnvelope<{ accessToken: string; expiresIn: number; user: User }>
  >("/auth/refresh", {}, { withCredentials: true });
  return response.data.data;
}

/**
 * POST /auth/logout
 * Logout — clears refresh token cookie server-side
 */
export async function logoutApi(): Promise<void> {
  await apiClient.post("/auth/logout", {}, { withCredentials: true });
}

/**
 * GET /auth/me
 * Get current authenticated user
 */
export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<ApiEnvelope<User>>("/auth/me");
  return response.data.data;
}