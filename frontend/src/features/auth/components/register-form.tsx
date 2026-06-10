// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/register-form.tsx
// 4-step registration form with React Hook Form + Zod
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  registerStep4Schema,
  type RegisterStep1Values,
  type RegisterStep2Values,
  type RegisterStep3Values,
  type RegisterStep4Values,
} from "@/features/auth/schemas/register.schema";
import { useRegister } from "@/lib/queries/auth";
import { AuthCard } from "./auth-card";
import type { Language, SoilType } from "@/types/auth";

const TOTAL_STEPS = 4;

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "mr", label: "मराठी" },
  { value: "hi", label: "हिंदी" },
  { value: "gu", label: "ગુજરાતી" },
  { value: "ta", label: "தமிழ்" },
  { value: "kn", label: "ಕನ್ನಡ" },
];

const SOIL_TYPES: { value: SoilType; labelKey: string }[] = [
  { value: "alluvial", labelKey: "soil.alluvial" },
  { value: "black", labelKey: "soil.black" },
  { value: "red", labelKey: "soil.red" },
  { value: "laterite", labelKey: "soil.laterite" },
  { value: "desert", labelKey: "soil.desert" },
  { value: "mountain", labelKey: "soil.mountain" },
  { value: "saline", labelKey: "soil.saline" },
  { value: "peaty", labelKey: "soil.peaty" },
];

// Aggregated form data across steps
type AllFormData = RegisterStep1Values &
  RegisterStep2Values &
  RegisterStep3Values &
  RegisterStep4Values;

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AllFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  // ─── Step 1 Form ───────────────────────────────────────────────────────────
  const step1 = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: formData as RegisterStep1Values,
  });

  // ─── Step 2 Form ───────────────────────────────────────────────────────────
  const step2 = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: formData as RegisterStep2Values,
  });

  // ─── Step 3 Form ───────────────────────────────────────────────────────────
  const step3 = useForm<RegisterStep3Values>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: formData as RegisterStep3Values,
  });

  // ─── Step 4 Form ───────────────────────────────────────────────────────────
  const step4 = useForm<RegisterStep4Values>({
    resolver: zodResolver(registerStep4Schema),
    defaultValues: formData as RegisterStep4Values,
  });

  const advanceTo = (next: number, data: Partial<AllFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(next);
  };

  const onStep1 = step1.handleSubmit((data) => advanceTo(2, data));
  const onStep2 = step2.handleSubmit((data) => advanceTo(3, data));
  const onStep3 = step3.handleSubmit((data) => advanceTo(4, data));

  const onStep4 = step4.handleSubmit(async (data) => {
    const payload = { ...formData, ...data } as AllFormData;
    try {
      await registerMutation.mutateAsync({
        name: payload.name,
        mobile: payload.mobile,
        language: payload.language,
        state: payload.state,
        district: payload.district,
        village: payload.village,
        landSizeAcres: payload.landSizeAcres,
        soilType: payload.soilType,
        password: payload.password,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("errors.register_failed");
      step4.setError("root", { message });
    }
  });

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const stepTitles = [
    t("register.step1_title"),
    t("register.step2_title"),
    t("register.step3_title"),
    t("register.step4_title"),
  ];

  return (
    <AuthCard
      title={stepTitles[step - 1]}
      subtitle={t("register.subtitle")}
      footer={
        step === 1 ? (
          <p className="auth-footer-text">
            {t("register.have_account")}{" "}
            <Link href={`/${locale}/login`} className="auth-link">
              {t("register.login_link")}
            </Link>
          </p>
        ) : undefined
      }
    >
      {/* ── Progress ── */}
      <div className="register-progress" aria-label={t("register.progress_label")}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`register-progress__step ${
              i + 1 < step
                ? "register-progress__step--done"
                : i + 1 === step
                ? "register-progress__step--active"
                : ""
            }`}
            aria-current={i + 1 === step ? "step" : undefined}
          >
            {i + 1 < step ? <Check size={12} /> : <span>{i + 1}</span>}
          </div>
        ))}
        <div
          className="register-progress__bar"
          style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        />
      </div>

      {/* ════════════════════ STEP 1 ════════════════════ */}
      {step === 1 && (
        <form onSubmit={onStep1} noValidate>
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">
              {t("fields.full_name")}
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder={t("fields.full_name_placeholder")}
              className={`auth-input ${step1.formState.errors.name ? "auth-input--error" : ""}`}
              aria-invalid={!!step1.formState.errors.name}
              {...step1.register("name")}
            />
            {step1.formState.errors.name && (
              <p className="auth-field-error">
                {t(step1.formState.errors.name.message as string)}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="auth-field">
            <label htmlFor="reg-mobile" className="auth-label">
              {t("fields.mobile")}
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix">+91</span>
              <input
                id="reg-mobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                placeholder={t("fields.mobile_placeholder")}
                className={`auth-input auth-input--with-prefix ${
                  step1.formState.errors.mobile ? "auth-input--error" : ""
                }`}
                aria-invalid={!!step1.formState.errors.mobile}
                {...step1.register("mobile")}
              />
            </div>
            {step1.formState.errors.mobile && (
              <p className="auth-field-error">
                {t(step1.formState.errors.mobile.message as string)}
              </p>
            )}
          </div>

          {/* Language */}
          <div className="auth-field">
            <label htmlFor="reg-language" className="auth-label">
              {t("fields.preferred_language")}
            </label>
            <select
              id="reg-language"
              className={`auth-select ${step1.formState.errors.language ? "auth-input--error" : ""}`}
              {...step1.register("language")}
            >
              <option value="">{t("fields.select_language")}</option>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            {step1.formState.errors.language && (
              <p className="auth-field-error">
                {step1.formState.errors.language.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="auth-field">
            <span className="auth-label">{t("fields.role")}</span>
            <div className="role-grid" role="radiogroup" aria-label={t("fields.role")}>
              {(["farmer", "consultant", "fpo_manager"] as const).map((r) => (
                <label key={r} className="role-card">
                  <input
                    type="radio"
                    value={r}
                    className="role-card__input"
                    {...step1.register("role")}
                  />
                  <span className="role-card__icon">
                    {r === "farmer" ? "🌱" : r === "consultant" ? "👨‍🌾" : "🏢"}
                  </span>
                  <span className="role-card__label">{t(`roles.${r}`)}</span>
                </label>
              ))}
            </div>
            {step1.formState.errors.role && (
              <p className="auth-field-error">
                {t(step1.formState.errors.role.message as string)}
              </p>
            )}
          </div>

          <button type="submit" className="auth-btn auth-btn--primary">
            {t("register.next")} <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* ════════════════════ STEP 2 ════════════════════ */}
      {step === 2 && (
        <form onSubmit={onStep2} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-state" className="auth-label">
              {t("fields.state")}
            </label>
            <input
              id="reg-state"
              type="text"
              placeholder={t("fields.state_placeholder")}
              className={`auth-input ${step2.formState.errors.state ? "auth-input--error" : ""}`}
              {...step2.register("state")}
            />
            {step2.formState.errors.state && (
              <p className="auth-field-error">
                {t(step2.formState.errors.state.message as string)}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-district" className="auth-label">
              {t("fields.district")}
            </label>
            <input
              id="reg-district"
              type="text"
              placeholder={t("fields.district_placeholder")}
              className={`auth-input ${step2.formState.errors.district ? "auth-input--error" : ""}`}
              {...step2.register("district")}
            />
            {step2.formState.errors.district && (
              <p className="auth-field-error">
                {t(step2.formState.errors.district.message as string)}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-village" className="auth-label">
              {t("fields.village")}{" "}
              <span className="auth-label__optional">({t("fields.optional")})</span>
            </label>
            <input
              id="reg-village"
              type="text"
              placeholder={t("fields.village_placeholder")}
              className="auth-input"
              {...step2.register("village")}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-pincode" className="auth-label">
              {t("fields.pincode")}{" "}
              <span className="auth-label__optional">({t("fields.optional")})</span>
            </label>
            <input
              id="reg-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="400001"
              className={`auth-input ${step2.formState.errors.pincode ? "auth-input--error" : ""}`}
              {...step2.register("pincode")}
            />
            {step2.formState.errors.pincode && (
              <p className="auth-field-error">
                {t(step2.formState.errors.pincode.message as string)}
              </p>
            )}
          </div>

          <div className="auth-btn-row">
            <button type="button" onClick={goBack} className="auth-btn auth-btn--ghost">
              <ArrowLeft size={18} /> {t("register.back")}
            </button>
            <button type="submit" className="auth-btn auth-btn--primary">
              {t("register.next")} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ════════════════════ STEP 3 ════════════════════ */}
      {step === 3 && (
        <form onSubmit={onStep3} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-land" className="auth-label">
              {t("fields.land_size")}{" "}
              <span className="auth-label__optional">({t("fields.optional")})</span>
            </label>
            <div className="auth-input-wrap auth-input-wrap--suffix">
              <input
                id="reg-land"
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                placeholder="e.g. 2.5"
                className={`auth-input ${step3.formState.errors.landSizeAcres ? "auth-input--error" : ""}`}
                {...step3.register("landSizeAcres", { valueAsNumber: true })}
              />
              <span className="auth-input-suffix">{t("fields.acres")}</span>
            </div>
            {step3.formState.errors.landSizeAcres && (
              <p className="auth-field-error">
                {t(step3.formState.errors.landSizeAcres.message as string)}
              </p>
            )}
          </div>

          <div className="auth-field">
            <span className="auth-label">
              {t("fields.soil_type")}{" "}
              <span className="auth-label__optional">({t("fields.optional")})</span>
            </span>
            <div className="soil-grid">
              {SOIL_TYPES.map(({ value, labelKey }) => (
                <label key={value} className="soil-card">
                  <input
                    type="radio"
                    value={value}
                    className="soil-card__input"
                    {...step3.register("soilType")}
                  />
                  <span className="soil-card__label">{t(labelKey)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="auth-btn-row">
            <button type="button" onClick={goBack} className="auth-btn auth-btn--ghost">
              <ArrowLeft size={18} /> {t("register.back")}
            </button>
            <button type="submit" className="auth-btn auth-btn--primary">
              {t("register.next")} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ════════════════════ STEP 4 ════════════════════ */}
      {step === 4 && (
        <form onSubmit={onStep4} noValidate>
          {step4.formState.errors.root && (
            <div className="auth-error-banner" role="alert">
              {step4.formState.errors.root.message}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">
              {t("fields.password")}
            </label>
            <div className="auth-input-wrap">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("fields.password_placeholder")}
                className={`auth-input ${step4.formState.errors.password ? "auth-input--error" : ""}`}
                {...step4.register("password")}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t("fields.hide_password") : t("fields.show_password")}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {step4.formState.errors.password && (
              <p className="auth-field-error">
                {t(step4.formState.errors.password.message as string)}
              </p>
            )}
            <PasswordStrength password={step4.watch("password") ?? ""} t={t} />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm-password" className="auth-label">
              {t("fields.confirm_password")}
            </label>
            <input
              id="reg-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("fields.confirm_password_placeholder")}
              className={`auth-input ${step4.formState.errors.confirmPassword ? "auth-input--error" : ""}`}
              {...step4.register("confirmPassword")}
            />
            {step4.formState.errors.confirmPassword && (
              <p className="auth-field-error">
                {t(step4.formState.errors.confirmPassword.message as string)}
              </p>
            )}
          </div>

          <div className="auth-btn-row">
            <button type="button" onClick={goBack} className="auth-btn auth-btn--ghost">
              <ArrowLeft size={18} /> {t("register.back")}
            </button>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="auth-btn auth-btn--primary"
              aria-busy={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 size={18} className="auth-btn__spinner" />
                  {t("register.submitting")}
                </>
              ) : (
                <>
                  {t("register.submit")} <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

// ─── Password Strength Indicator ─────────────────────────────────────────────

function PasswordStrength({
  password,
  t,
}: {
  password: string;
  t: ReturnType<typeof useTranslations<"auth">>;
}) {
  const checks = [
    { label: t("password_strength.min_length"), pass: password.length >= 8 },
    { label: t("password_strength.uppercase"), pass: /[A-Z]/.test(password) },
    { label: t("password_strength.number"), pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;

  if (!password) return null;

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength__bars">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`password-strength__bar ${
              i < strength
                ? strength === 1
                  ? "password-strength__bar--weak"
                  : strength === 2
                  ? "password-strength__bar--medium"
                  : "password-strength__bar--strong"
                : ""
            }`}
          />
        ))}
      </div>
      <ul className="password-strength__checks">
        {checks.map((c, i) => (
          <li
            key={i}
            className={`password-strength__check ${c.pass ? "password-strength__check--pass" : ""}`}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
