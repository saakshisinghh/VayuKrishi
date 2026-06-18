// ─────────────────────────────────────────────────────────────────────────────
// src/app/[locale]/(auth)/register/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("register.page_title"),
    description: t("register.page_description"),
  };
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
