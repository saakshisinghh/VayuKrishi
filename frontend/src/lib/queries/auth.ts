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
      // loginApi() already unwraps the backend's { success, data, ... }
      // envelope (see lib/api/auth.ts), so `response` here is the clean
      // { user, accessToken, expiresIn } payload.
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
      // ── Registration: OTP just confirms the mobile number.
      //    User must sign in manually afterwards — do NOT auto-login,
      //    even if the API happens to return a session.
      if (variables.purpose === "register") {
        router.push(`/${locale}/login?registered=success`);
        return;
      }

      // ── Login / generic: session returned, log the user in.
      // verifyOtpApi() already unwraps the envelope, so `response` is
      // the clean { message, result? } payload.
      const result = response.result;
      if (result?.user && result?.accessToken) {
        login(result.user, result.accessToken);
        router.push(`/${locale}/overview`);
        return;
      }

      // ── Forgot password: OTP step done, move to password reset step.
      if (variables.purpose === "forgot_password") {
        router.push(
          `/${locale}/forgot-password?step=reset&mobile=${encodeURIComponent(variables.mobile)}`
        );
        return;
      }

      // ── Safety net: never leave the user stuck on "Verified…" with
      //    no navigation. If we get here, the response shape didn't
      //    match any known purpose — fall back to login.
      router.push(`/${locale}/login`);
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