// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/otp-form.tsx
// 6-digit OTP input — auto-focus, paste, resend timer
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from "react";
import { useTranslations } from "next-intl";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useVerifyOTP, useSendOTP } from "@/lib/queries/auth";
import { AuthCard } from "./auth-card";
import type { OTPPurpose } from "@/types/auth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface OTPFormProps {
  mobile: string;
  purpose: OTPPurpose;
}

export function OTPForm({ mobile, purpose }: OTPFormProps) {
  const t = useTranslations("auth");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const verifyMutation = useVerifyOTP();
  const sendOtpMutation = useSendOTP();

  // ─── Countdown Timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ─── Auto-focus first input on mount ──────────────────────────────────────
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ─── Auto-submit when all filled ──────────────────────────────────────────
  const otp = digits.join("");
  useEffect(() => {
    if (otp.length === OTP_LENGTH && digits.every((d) => d !== "")) {
      handleVerify(otp);
    }
  }, [otp]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = useCallback(
    async (code: string) => {
      setError(null);
      try {
        await verifyMutation.mutateAsync({ mobile, otp: code, purpose });
        setIsVerified(true);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { code?: string } } })?.response?.data
            ?.code === "OTP_EXPIRED"
            ? t("errors.otp_expired")
            : t("errors.otp_invalid");
        setError(msg);
        // Clear digits on error
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    },
    [mobile, purpose, t, verifyMutation]
  );

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError(null);

    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
  };

  const handleResend = async () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    setTimer(RESEND_SECONDS);
    try {
      await sendOtpMutation.mutateAsync({ mobile, purpose });
      inputRefs.current[0]?.focus();
    } catch {
      setError(t("errors.otp_send_failed"));
    }
  };

  const maskedMobile = `+91 ${mobile.slice(0, 2)}••••${mobile.slice(-2)}`;

  return (
    <AuthCard title={t("otp.title")} subtitle={`${t("otp.subtitle")} ${maskedMobile}`}>
      {isVerified ? (
        <div className="otp-success" role="status" aria-live="polite">
          <CheckCircle2 size={48} className="otp-success__icon" />
          <p className="otp-success__text">{t("otp.verified")}</p>
        </div>
      ) : (
        <>
          {/* ── Error banner ── */}
          {error && (
            <div className="auth-error-banner" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {/* ── OTP Inputs ── */}
          <div
            className="otp-grid"
            role="group"
            aria-label={t("otp.input_label")}
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                value={digit}
                aria-label={`${t("otp.digit_label")} ${index + 1}`}
                aria-invalid={!!error}
                disabled={verifyMutation.isPending || isVerified}
                className={`otp-input ${digit ? "otp-input--filled" : ""} ${
                  error ? "otp-input--error" : ""
                }`}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          {/* ── Loading / Verifying ── */}
          {verifyMutation.isPending && (
            <div className="otp-verifying" aria-live="polite" role="status">
              <Loader2 size={18} className="auth-btn__spinner" />
              <span>{t("otp.verifying")}</span>
            </div>
          )}

          {/* ── Resend ── */}
          <div className="otp-resend">
            {timer > 0 ? (
              <p className="otp-resend__timer" aria-live="polite">
                {t("otp.resend_in")}{" "}
                <span className="otp-resend__countdown">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={sendOtpMutation.isPending}
                className="auth-btn auth-btn--ghost"
                aria-busy={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending ? (
                  <Loader2 size={16} className="auth-btn__spinner" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {t("otp.resend")}
              </button>
            )}
          </div>
        </>
      )}
    </AuthCard>
  );
}
