import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PersonalDetails } from "@/features/profile/components/personal-details";
import { FarmProfile } from "@/features/profile/components/farm-profile";
import { LanguagePreferences } from "@/features/profile/components/language-preferences";
import { NotificationPreferences } from "@/features/profile/components/notification-preferences";
import { SecuritySettings } from "@/features/profile/components/security-settings";
import { ProfileSkeleton } from "@/features/profile/components/profile-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");
  return { title: t("meta.title"), description: t("meta.description") };
}

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{/* i18n via client */}</h1>
      </div>
      <Suspense fallback={<ProfileSkeleton />}>
        <PersonalDetails />
        <FarmProfile />
        <LanguagePreferences />
        <NotificationPreferences />
        <SecuritySettings />
      </Suspense>
    </div>
  );
}
