// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/schemas/register.schema.ts
// Multi-step registration validation
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

// Step 1 – Identity
export const registerStep1Schema = z.object({
  name: z
    .string()
    .min(2, "validation.name_min")
    .max(60, "validation.name_max")
    .regex(/^[\u0000-\u007F\u0900-\u097F\u0A80-\u0AFF\u0B80-\u0BFF\u0C80-\u0CFF ]+$/, "validation.name_chars"),
  mobile: z
    .string()
    .min(10, "validation.mobile_min")
    .max(10, "validation.mobile_max")
    .regex(/^[6-9]\d{9}$/, "validation.mobile_invalid"),
  language: z.enum(["en", "mr", "hi", "gu", "ta", "kn"], {
    errorMap: () => ({ message: "validation.language_required" }),
  }),
  role: z.enum(["farmer", "consultant", "fpo_manager"], {
    errorMap: () => ({ message: "validation.role_required" }),
  }),
});

// Step 2 – Location
export const registerStep2Schema = z.object({
  state: z.string().min(1, "validation.state_required"),
  district: z.string().min(1, "validation.district_required"),
  village: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "validation.pincode_invalid")
    .optional()
    .or(z.literal("")),
});

// Step 3 – Farm Info
export const registerStep3Schema = z.object({
  landSizeAcres: z
    .number({ invalid_type_error: "validation.land_size_number" })
    .min(0.1, "validation.land_size_min")
    .max(10000, "validation.land_size_max")
    .optional(),
  soilType: z
    .enum(["alluvial", "black", "red", "laterite", "desert", "mountain", "saline", "peaty"])
    .optional(),
});

// Step 4 – Password
export const registerStep4Schema = z
  .object({
    password: z
      .string()
      .min(8, "validation.password_min")
      .max(128, "validation.password_max")
      .regex(/[A-Z]/, "validation.password_uppercase")
      .regex(/[0-9]/, "validation.password_number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.password_mismatch",
    path: ["confirmPassword"],
  });

// Combined schema for final submission
export const registerSchema = registerStep1Schema
  .merge(registerStep2Schema)
  .merge(registerStep3Schema)
  .merge(registerStep4Schema);

export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Values = z.infer<typeof registerStep2Schema>;
export type RegisterStep3Values = z.infer<typeof registerStep3Schema>;
export type RegisterStep4Values = z.infer<typeof registerStep4Schema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
