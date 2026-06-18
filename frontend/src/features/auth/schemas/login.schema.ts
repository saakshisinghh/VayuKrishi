// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/schemas/login.schema.ts
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const loginSchema = z.object({
  mobile: z
    .string()
    .min(10, "validation.mobile_min")
    .max(10, "validation.mobile_max")
    .regex(/^[6-9]\d{9}$/, "validation.mobile_invalid"),
  password: z
    .string()
    .min(8, "validation.password_min")
    .max(128, "validation.password_max"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpLoginSchema = z.object({
  mobile: z
    .string()
    .min(10, "validation.mobile_min")
    .max(10, "validation.mobile_max")
    .regex(/^[6-9]\d{9}$/, "validation.mobile_invalid"),
});

export type OTPLoginFormValues = z.infer<typeof otpLoginSchema>;
