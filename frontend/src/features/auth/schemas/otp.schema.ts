// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/schemas/otp.schema.ts
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "validation.otp_length")
    .regex(/^\d{6}$/, "validation.otp_digits"),
});

export type OTPFormValues = z.infer<typeof otpSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/schemas/forgot-password.schema.ts
// ─────────────────────────────────────────────────────────────────────────────

export const forgotPasswordMobileSchema = z.object({
  mobile: z
    .string()
    .min(10, "validation.mobile_min")
    .max(10, "validation.mobile_max")
    .regex(/^[6-9]\d{9}$/, "validation.mobile_invalid"),
});

export const forgotPasswordOTPSchema = z.object({
  otp: z
    .string()
    .length(6, "validation.otp_length")
    .regex(/^\d{6}$/, "validation.otp_digits"),
});

export const forgotPasswordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "validation.password_min")
      .max(128, "validation.password_max")
      .regex(/[A-Z]/, "validation.password_uppercase")
      .regex(/[0-9]/, "validation.password_number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "validation.password_mismatch",
    path: ["confirmPassword"],
  });

export type ForgotPasswordMobileValues = z.infer<typeof forgotPasswordMobileSchema>;
export type ForgotPasswordOTPValues = z.infer<typeof forgotPasswordOTPSchema>;
export type ForgotPasswordResetValues = z.infer<typeof forgotPasswordResetSchema>;
