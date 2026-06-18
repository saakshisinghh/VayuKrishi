// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/auth-skeletons.tsx
// Loading skeletons for auth pages
// ─────────────────────────────────────────────────────────────────────────────

"use client";

export function LoginSkeleton() {
  return (
    <div className="auth-skeleton" aria-label="Loading login form" aria-busy="true">
      <div className="auth-skeleton__logo" />
      <div className="auth-skeleton__title" />
      <div className="auth-skeleton__subtitle" />
      <div className="auth-skeleton__field">
        <div className="auth-skeleton__label" />
        <div className="auth-skeleton__input" />
      </div>
      <div className="auth-skeleton__field">
        <div className="auth-skeleton__label" />
        <div className="auth-skeleton__input" />
      </div>
      <div className="auth-skeleton__btn" />
      <div className="auth-skeleton__divider" />
      <div className="auth-skeleton__btn auth-skeleton__btn--secondary" />
    </div>
  );
}

export function RegisterSkeleton() {
  return (
    <div className="auth-skeleton" aria-label="Loading register form" aria-busy="true">
      <div className="auth-skeleton__progress" />
      <div className="auth-skeleton__title" />
      <div className="auth-skeleton__subtitle" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="auth-skeleton__field">
          <div className="auth-skeleton__label" />
          <div className="auth-skeleton__input" />
        </div>
      ))}
      <div className="auth-skeleton__btn" />
    </div>
  );
}

export function OTPVerificationSkeleton() {
  return (
    <div className="auth-skeleton" aria-label="Loading OTP form" aria-busy="true">
      <div className="auth-skeleton__title" />
      <div className="auth-skeleton__subtitle" />
      <div className="auth-skeleton__otp-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="auth-skeleton__otp-digit" />
        ))}
      </div>
      <div className="auth-skeleton__resend" />
    </div>
  );
}
