// ─────────────────────────────────────────────────────────────────────────────
// src/lib/queries/auth.ts
// TanStack Query hooks for auth operations
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  loginApi,
  registerApi,
  verifyOtpApi,
  sendOtpApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi,
  getMeApi,
} from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import type {
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  OTPSendRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const { login } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (response) => {
      login(response.user, response.accessToken);
      router.push(`/${locale}/overview`);
    },
  });
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
    onSuccess: (_, variables) => {
      // Navigate to OTP verification with mobile in state
      router.push(
        `/${locale}/otp?mobile=${encodeURIComponent(variables.mobile)}&purpose=register`
      );
    },
  });
}

// ─── useVerifyOTP ─────────────────────────────────────────────────────────────

export function useVerifyOTP() {
  const { login } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: OTPVerifyRequest) => verifyOtpApi(data),
    onSuccess: (response, variables) => {
      if (response.user && response.accessToken) {
        // Login / register OTP verified
        login(response.user, response.accessToken);
        router.push(`/${locale}/overview`);
      } else if (variables.purpose === "forgot_password") {
        // OTP step done, now reset password
        router.push(
          `/${locale}/forgot-password?step=reset&mobile=${encodeURIComponent(variables.mobile)}`
        );
      }
    },
  });
}

// ─── useSendOTP ───────────────────────────────────────────────────────────────

export function useSendOTP() {
  return useMutation({
    mutationFn: (data: OTPSendRequest) => sendOtpApi(data),
  });
}

// ─── useForgotPassword ────────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPasswordApi(data),
  });
}

// ─── useResetPassword ─────────────────────────────────────────────────────────

export function useResetPassword() {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPasswordApi(data),
    onSuccess: () => {
      router.push(`/${locale}/login?reset=success`);
    },
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push(`/${locale}/login`);
    },
  });
}

// ─── useCurrentUser ───────────────────────────────────────────────────────────

export function useCurrentUser() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      const user = await getMeApi();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// ─── useRefreshSession ────────────────────────────────────────────────────────

export function useRefreshSession() {
  const { refreshSession } = useAuthStore();

  return useMutation({
    mutationFn: refreshSession,
  });
}
