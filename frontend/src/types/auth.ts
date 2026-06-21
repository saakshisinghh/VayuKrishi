// ─────────────────────────────────────────────────────────────────────────────
// src/types/auth.ts
// Core authentication & authorization types for Vayukrishi
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole =
  | "farmer"
  | "consultant"
  | "fpo_manager"
  | "government_officer"
  | "admin";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type OTPPurpose = "login" | "register" | "forgot_password";

export type Language = "en" | "mr" | "hi" | "gu" | "ta" | "kn";

export type SoilType =
  | "alluvial"
  | "black"
  | "red"
  | "laterite"
  | "desert"
  | "mountain"
  | "saline"
  | "peaty";

// ─── User ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  language: Language;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  state: string;
  district: string;
  village?: string;
  pincode?: string;
  landSizeAcres?: number;
  soilType?: SoilType;
  primaryCrops?: string[];
}

// ─── API envelope ─────────────────────────────────────────────────────────────
// IMPORTANT: every backend response is wrapped by a controller/middleware
// layer in this exact shape — confirmed directly from the network tab:
//
//   {
//     "success": true,
//     "data": { ...the actual payload... },
//     "message": "...",
//     "timestamp": "..."
//   }
//
// `apiClient` (src/lib/api/axios.ts) does NOT unwrap this — its response
// interceptor returns `response` as-is, so `response.data` (axios's own
// `.data` field) is this WHOLE envelope, not the inner payload. Each
// `*Api()` function in src/lib/api/auth.ts then returns `response.data`,
// meaning callers receive the envelope and must read `.data.<field>`
// themselves. Define each endpoint's response type as the inner payload
// shape, and reference it through `ApiEnvelope<T>` so this is explicit
// and TypeScript catches it if it's ever wrong again.

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// ─── Auth Tokens ─────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ─── API Request / Response Types ─────────────────────────────────────────────
// These describe the INNER payload (the `data` field of ApiEnvelope<T>),
// matching the backend's auth.service.ts return values exactly.

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  expiresIn: number;
}
export type LoginResponse = LoginResponseData;

export interface RegisterRequest {
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

export interface RegisterResponseData {
  message: string;
  mobile: string;
  otpExpiresIn: number;
}
export type RegisterResponse = RegisterResponseData;

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
  purpose: OTPPurpose;
}

export interface OTPVerifyResponseData {
  message: string;
  result?: {
    user: User;
    accessToken: string;
    expiresIn: number;
  };
}
export type OTPVerifyResponse = OTPVerifyResponseData;

export interface OTPSendRequest {
  mobile: string;
  purpose: OTPPurpose;
}

export interface OTPSendResponseData {
  message: string;
  otpExpiresIn: number; // seconds
}
export type OTPSendResponse = OTPSendResponseData;

export interface ForgotPasswordRequest {
  mobile: string;
}

export interface ResetPasswordRequest {
  mobile: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponseData {
  message: string;
}
export type ResetPasswordResponse = ResetPasswordResponseData;

// ─── Auth Store State ─────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  status: AuthStatus;
  role: UserRole | null;
  language: Language;
}

export interface AuthActions {
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setLanguage: (language: Language) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  refreshSession: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// ─── Permission Types ─────────────────────────────────────────────────────────

export type Permission =
  | "view:dashboard"
  | "view:crop_recommendation"
  | "view:disease_detection"
  | "view:assistant"
  | "view:market"
  | "view:farm_health"
  | "view:planner"
  | "view:schemes"
  | "view:analytics"
  | "manage:users"
  | "manage:farmers"
  | "manage:consultants"
  | "manage:fpo"
  | "manage:schemes"
  | "manage:system"
  | "view:all_farms"
  | "edit:farm_data"
  | "approve:applications"
  | "generate:reports";

export type RolePermissions = Record<UserRole, Permission[]>;