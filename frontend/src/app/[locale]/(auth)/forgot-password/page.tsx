// ─────────────────────────────────────────────────────────────────────────────
// src/app/[locale]/(auth)/forgot-password/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("forgot.page_title"),
    description: t("forgot.page_description"),
  };
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
