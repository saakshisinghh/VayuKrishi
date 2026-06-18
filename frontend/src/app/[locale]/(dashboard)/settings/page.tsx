import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GeneralSettings } from "@/features/settings/components/general-settings";
import { VoiceSettings } from "@/features/settings/components/voice-settings";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { PrivacySettings } from "@/features/settings/components/privacy-settings";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings");
  return { title: t("meta.title") };
}

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse" />}>
        <GeneralSettings />
        <VoiceSettings />
        <NotificationSettings />
        <PrivacySettings />
      </Suspense>
    </div>
  );
}
