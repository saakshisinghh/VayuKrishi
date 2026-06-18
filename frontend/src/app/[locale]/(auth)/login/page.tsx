// ─────────────────────────────────────────────────────────────────────────────
// src/app/[locale]/(auth)/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("login.page_title"),
    description: t("login.page_description"),
  };
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
