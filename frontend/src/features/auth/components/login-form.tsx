// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/login-form.tsx
// Premium login form — password + OTP toggle
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Eye, EyeOff, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import { useLogin, useSendOTP } from "@/lib/queries/auth";
import { AuthCard } from "./auth-card";

type Mode = "password" | "otp";

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [mode, setMode] = useState<Mode>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");

  const loginMutation = useLogin();
  const sendOtpMutation = useSendOTP();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // ─── Password Login ────────────────────────────────────────────────────────
  const onPasswordLogin = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("errors.invalid_credentials");
      setError("root", { message });
    }
  };

  // ─── Send OTP for login ────────────────────────────────────────────────────
  const onSendOTP = async () => {
    const mobile = getValues("mobile");
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      // Store the translation KEY here, not the resolved string.
      // The JSX below calls t(errors.mobile.message) once — translating
      // here too would cause a double-translation MISSING_MESSAGE error.
      setError("mobile", { message: "validation.mobile_invalid" });
      return;
    }
    try {
      await sendOtpMutation.mutateAsync({ mobile, purpose: "login" });
      setOtpMobile(mobile);
      // Navigate to OTP page
      window.location.href = `/${locale}/otp?mobile=${encodeURIComponent(mobile)}&purpose=login`;
    } catch {
      setError("root", { message: t("errors.otp_send_failed") });
    }
  };

  return (
    <AuthCard
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      footer={
        <p className="auth-footer-text">
          {t("login.no_account")}{" "}
          <Link href={`/${locale}/register`} className="auth-link">
            {t("login.register_link")}
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(onPasswordLogin)}
        noValidate
        aria-label={t("login.form_label")}
      >
        {/* ── Root error ── */}
        {errors.root && (
          <div className="auth-error-banner" role="alert" aria-live="polite">
            <span>{errors.root.message}</span>
          </div>
        )}

        {/* ── Mobile Number ── */}
        <div className="auth-field">
          <label htmlFor="login-mobile" className="auth-label">
            {t("fields.mobile")}
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Phone size={18} />
            </span>
            <span className="auth-input-prefix" aria-hidden="true">
              +91
            </span>
            <input
              id="login-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder={t("fields.mobile_placeholder")}
              aria-describedby={errors.mobile ? "login-mobile-error" : undefined}
              aria-invalid={!!errors.mobile}
              className={`auth-input auth-input--with-prefix ${
                errors.mobile ? "auth-input--error" : ""
              }`}
              {...register("mobile")}
            />
          </div>
          {errors.mobile && (
            <p id="login-mobile-error" className="auth-field-error" role="alert">
              {t(errors.mobile.message as string)}
            </p>
          )}
        </div>

        {/* ── Password (shown in password mode) ── */}
        {mode === "password" && (
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">
                {t("fields.password")}
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="auth-link auth-link--small"
              >
                {t("login.forgot_password")}
              </Link>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("fields.password_placeholder")}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                aria-invalid={!!errors.password}
                className={`auth-input auth-input--with-icon ${
                  errors.password ? "auth-input--error" : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? t("fields.hide_password") : t("fields.show_password")
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p
                id="login-password-error"
                className="auth-field-error"
                role="alert"
              >
                {t(errors.password.message as string)}
              </p>
            )}
          </div>
        )}

        {/* ── Actions ── */}
        {mode === "password" ? (
          <>
            <button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="auth-btn auth-btn--primary"
              aria-busy={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={18} className="auth-btn__spinner" aria-hidden="true" />
                  {t("login.logging_in")}
                </>
              ) : (
                <>
                  {t("login.submit")}
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>{t("login.or")}</span>
            </div>

            <button
              type="button"
              onClick={onSendOTP}
              disabled={sendOtpMutation.isPending}
              className="auth-btn auth-btn--secondary"
              aria-busy={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? (
                <>
                  <Loader2 size={18} className="auth-btn__spinner" aria-hidden="true" />
                  {t("login.sending_otp")}
                </>
              ) : (
                t("login.continue_with_otp")
              )}
            </button>
          </>
        ) : null}
      </form>
    </AuthCard>
  );
}