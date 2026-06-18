// ─────────────────────────────────────────────────────────────────────────────
// src/app/[locale]/(auth)/otp/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { OTPForm } from "@/features/auth/components/otp-form";
import type { OTPPurpose } from "@/types/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("otp.page_title"),
    description: t("otp.page_description"),
  };
}

interface OTPPageProps {
  params: { locale: string };
  searchParams: {
    mobile?: string;
    purpose?: string;
  };
}

const VALID_PURPOSES: OTPPurpose[] = ["login", "register", "forgot_password"];

export default function OTPPage({ searchParams, params }: OTPPageProps) {
  const { mobile, purpose } = searchParams;

  // Validate required query params
  if (!mobile || !purpose || !VALID_PURPOSES.includes(purpose as OTPPurpose)) {
    redirect(`/${params.locale}/login`);
  }

  return (
    <AuthLayout>
      <OTPForm mobile={mobile} purpose={purpose as OTPPurpose} />
    </AuthLayout>
  );
}
