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

// ─── User ────────────────────────────────────────────────────────────────────

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

// ─── Auth Tokens ─────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ─── API Request / Response Types ────────────────────────────────────────────

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

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

export interface RegisterResponse {
  message: string;
  mobile: string;
  otpExpiresIn: number;
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
  purpose: OTPPurpose;
}

export interface OTPVerifyResponse {
  user?: User;
  accessToken?: string;
  expiresIn?: number;
  message: string;
}

export interface OTPSendRequest {
  mobile: string;
  purpose: OTPPurpose;
}

export interface OTPSendResponse {
  message: string;
  otpExpiresIn: number; // seconds
}

export interface ForgotPasswordRequest {
  mobile: string;
}

export interface ResetPasswordRequest {
  mobile: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

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
