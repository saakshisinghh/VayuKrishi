"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";

export function PrivacySettings() {
  const t = useTranslations("settings.privacy");
  const { privacySettings, togglePrivacySetting } = useSettingsStore();

  const items = [
    { key: "dataSharing" as const, labelKey: "dataSharing", descKey: "dataSharingDesc" },
    { key: "analytics" as const, labelKey: "analytics", descKey: "analyticsDesc" },
    { key: "accountVisibility" as const, labelKey: "accountVisibility", descKey: "accountVisibilityDesc" },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-6" aria-labelledby="privacy-settings-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
          <Lock className="w-4 h-4 text-red-600" aria-hidden="true" />
        </div>
        <h2 id="privacy-settings-heading" className="text-base font-semibold text-foreground">{t("title")}</h2>
      </div>

      <div>
        {items.map(({ key, labelKey, descKey }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-foreground">{t(labelKey)}</p>
              <p className="text-xs text-muted-foreground">{t(descKey)}</p>
            </div>
            <button
              role="switch"
              aria-checked={privacySettings[key]}
              aria-label={t(labelKey)}
              onClick={() => togglePrivacySetting(key)}
              className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                privacySettings[key] ? "bg-emerald-500" : "bg-muted"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${privacySettings[key] ? "translate-x-5" : "translate-x-1"}`} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
