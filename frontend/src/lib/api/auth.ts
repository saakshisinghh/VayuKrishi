// ─────────────────────────────────────────────────────────────────────────────
// src/lib/api/auth.ts
// Auth API endpoints — integrates with existing axios instance
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
  OTPSendRequest,
  OTPSendResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenResponse,
  User,
} from "@/types/auth";

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Password-based login
 */
export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
}

/**
 * POST /auth/register
 * New user registration — triggers OTP
 */
export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>("/auth/register", data);
  return response.data;
}

/**
 * POST /auth/otp/verify
 * Verify OTP for login, register, or forgot password
 */
export async function verifyOtpApi(data: OTPVerifyRequest): Promise<OTPVerifyResponse> {
  const response = await apiClient.post<OTPVerifyResponse>("/auth/otp/verify", data);
  return response.data;
}

/**
 * POST /auth/otp/send
 * Send or resend OTP
 */
export async function sendOtpApi(data: OTPSendRequest): Promise<OTPSendResponse> {
  const response = await apiClient.post<OTPSendResponse>("/auth/otp/send", data);
  return response.data;
}

/**
 * POST /auth/forgot-password
 * Initiate forgot password flow
 */
export async function forgotPasswordApi(
  data: ForgotPasswordRequest
): Promise<OTPSendResponse> {
  const response = await apiClient.post<OTPSendResponse>("/auth/forgot-password", data);
  return response.data;
}

/**
 * POST /auth/reset-password
 * Reset password with OTP verification
 */
export async function resetPasswordApi(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    data
  );
  return response.data;
}

/**
 * POST /auth/refresh
 * Refresh access token using HTTP-only cookie
 */
export async function refreshTokenApi(): Promise<
  RefreshTokenResponse & { user: User }
> {
  const response = await apiClient.post<RefreshTokenResponse & { user: User }>(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
  return response.data;
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
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}
