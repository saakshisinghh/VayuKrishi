// notification-settings.tsx
"use client";

import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";

export function NotificationSettings() {
  const t = useTranslations("settings.notifications");
  const { notificationSettings, toggleNotificationSetting } = useSettingsStore();

  const items = [
    { key: "weather" as const, labelKey: "weather", descKey: "weatherDesc" },
    { key: "disease" as const, labelKey: "disease", descKey: "diseaseDesc" },
    { key: "market" as const, labelKey: "market", descKey: "marketDesc" },
    { key: "scheme" as const, labelKey: "scheme", descKey: "schemeDesc" },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-6" aria-labelledby="notif-settings-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
          <Bell className="w-4 h-4 text-amber-600" aria-hidden="true" />
        </div>
        <h2 id="notif-settings-heading" className="text-base font-semibold text-foreground">{t("title")}</h2>
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
              aria-checked={notificationSettings[key]}
              aria-label={t(labelKey)}
              onClick={() => toggleNotificationSetting(key)}
              className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                notificationSettings[key] ? "bg-emerald-500" : "bg-muted"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notificationSettings[key] ? "translate-x-5" : "translate-x-1"}`} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
