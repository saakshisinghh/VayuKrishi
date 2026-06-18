// security-settings.tsx
"use client";

import { useTranslations } from "next-intl";
import { Shield, Key, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SecuritySettings() {
  const t = useTranslations("profile.security");

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="security-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-red-600" aria-hidden="true" />
        </div>
        <h2 id="security-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start gap-2 text-sm h-10">
          <Key className="w-4 h-4" aria-hidden="true" />
          {t("changePhone")}
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2 text-sm h-10">
          <Smartphone className="w-4 h-4" aria-hidden="true" />
          {t("manageDevices")}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-sm h-10 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          {t("logoutAllDevices")}
        </Button>
      </div>
    </section>
  );
}
