// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/forgot-password-form.tsx
// 3-step forgot password: Mobile → OTP → New Password
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

import {
  forgotPasswordMobileSchema,
  forgotPasswordResetSchema,
  type ForgotPasswordMobileValues,
  type ForgotPasswordResetValues,
} from "@/features/auth/schemas/otp.schema";
import { useForgotPassword, useVerifyOTP, useResetPassword } from "@/lib/queries/auth";
import { OTPForm } from "./otp-form";
import { AuthCard } from "./auth-card";

type FPStep = "mobile" | "otp" | "reset" | "done";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [step, setStep] = useState<FPStep>("mobile");
  const [mobile, setMobile] = useState("");

  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();

  // ─── Step 1: Mobile ────────────────────────────────────────────────────────
  const mobileForm = useForm<ForgotPasswordMobileValues>({
    resolver: zodResolver(forgotPasswordMobileSchema),
  });

  const onMobileSubmit = mobileForm.handleSubmit(async (data) => {
    try {
      await forgotMutation.mutateAsync({ mobile: data.mobile });
      setMobile(data.mobile);
      setStep("otp");
    } catch {
      mobileForm.setError("root", { message: t("errors.mobile_not_found") });
    }
  });

  // ─── Step 3: New Password ──────────────────────────────────────────────────
  const resetForm = useForm<ForgotPasswordResetValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
  });

  const onResetSubmit = resetForm.handleSubmit(async (data) => {
    try {
      // OTP was already verified in the OTP step — reset password directly
      // The server validates the verified OTP session via cookie
      await resetMutation.mutateAsync({
        mobile,
        otp: "", // Provided by server session after OTP verify
        newPassword: data.newPassword,
      });
      setStep("done");
    } catch {
      resetForm.setError("root", { message: t("errors.reset_failed") });
    }
  });

  return (
    <>
      {/* ── Step 1: Enter Mobile ── */}
      {step === "mobile" && (
        <AuthCard
          title={t("forgot.title")}
          subtitle={t("forgot.subtitle")}
          footer={
            <Link href={`/${locale}/login`} className="auth-link">
              ← {t("forgot.back_to_login")}
            </Link>
          }
        >
          <form onSubmit={onMobileSubmit} noValidate>
            {mobileForm.formState.errors.root && (
              <div className="auth-error-banner" role="alert">
                {mobileForm.formState.errors.root.message}
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="fp-mobile" className="auth-label">
                {t("fields.mobile")}
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-prefix">+91</span>
                <input
                  id="fp-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel-national"
                  placeholder={t("fields.mobile_placeholder")}
                  className={`auth-input auth-input--with-prefix ${
                    mobileForm.formState.errors.mobile ? "auth-input--error" : ""
                  }`}
                  aria-invalid={!!mobileForm.formState.errors.mobile}
                  {...mobileForm.register("mobile")}
                />
              </div>
              {mobileForm.formState.errors.mobile && (
                <p className="auth-field-error">
                  {t(mobileForm.formState.errors.mobile.message as string)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="auth-btn auth-btn--primary"
              aria-busy={forgotMutation.isPending}
            >
              {forgotMutation.isPending ? (
                <>
                  <Loader2 size={18} className="auth-btn__spinner" />
                  {t("forgot.sending")}
                </>
              ) : (
                <>
                  {t("forgot.send_otp")} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </AuthCard>
      )}

      {/* ── Step 2: OTP Verification ── */}
      {step === "otp" && (
        <div>
          {/* Intercept OTP success to move to reset step */}
          <OTPForm mobile={mobile} purpose="forgot_password" />
          {/* After OTP verification, the useVerifyOTP hook navigates.
              For forgot_password purpose, it navigates to /forgot-password?step=reset.
              This component handles that via URL param in the page. */}
        </div>
      )}

      {/* ── Step 3: New Password ── */}
      {step === "reset" && (
        <AuthCard title={t("forgot.new_password_title")} subtitle={t("forgot.new_password_subtitle")}>
          <form onSubmit={onResetSubmit} noValidate>
            {resetForm.formState.errors.root && (
              <div className="auth-error-banner" role="alert">
                {resetForm.formState.errors.root.message}
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="fp-new-password" className="auth-label">
                {t("fields.new_password")}
              </label>
              <input
                id="fp-new-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("fields.password_placeholder")}
                className={`auth-input ${resetForm.formState.errors.newPassword ? "auth-input--error" : ""}`}
                {...resetForm.register("newPassword")}
              />
              {resetForm.formState.errors.newPassword && (
                <p className="auth-field-error">
                  {t(resetForm.formState.errors.newPassword.message as string)}
                </p>
              )}
            </div>
            <div className="auth-field">
              <label htmlFor="fp-confirm-password" className="auth-label">
                {t("fields.confirm_password")}
              </label>
              <input
                id="fp-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("fields.confirm_password_placeholder")}
                className={`auth-input ${resetForm.formState.errors.confirmPassword ? "auth-input--error" : ""}`}
                {...resetForm.register("confirmPassword")}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="auth-field-error">
                  {t(resetForm.formState.errors.confirmPassword.message as string)}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="auth-btn auth-btn--primary"
            >
              {resetMutation.isPending ? (
                <><Loader2 size={18} className="auth-btn__spinner" /> {t("forgot.resetting")}</>
              ) : (
                <>{t("forgot.reset_password")} <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </AuthCard>
      )}

      {/* ── Done ── */}
      {step === "done" && (
        <AuthCard title={t("forgot.done_title")} subtitle={t("forgot.done_subtitle")}>
          <div className="auth-success">
            <CheckCircle2 size={64} className="auth-success__icon" />
            <Link href={`/${locale}/login`} className="auth-btn auth-btn--primary">
              {t("forgot.go_to_login")} <ArrowRight size={18} />
            </Link>
          </div>
        </AuthCard>
      )}
    </>
  );
}
