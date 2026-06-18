// general-settings.tsx
"use client";

import { useTranslations } from "next-intl";
import { Settings, Sun, Moon, Monitor, Globe, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/store/settings-store";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, labelKey: "light" },
  { value: "dark", icon: Moon, labelKey: "dark" },
  { value: "system", icon: Monitor, labelKey: "system" },
] as const;

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST (UTC+5:30)" },
  { value: "Asia/Mumbai", label: "Mumbai" },
];

export function GeneralSettings() {
  const t = useTranslations("settings.general");
  const { theme, setTheme } = useTheme();
  const { timezone, setTimezone } = useSettingsStore();

  return (
    <section className="rounded-xl border border-border bg-card p-6" aria-labelledby="general-settings-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Settings className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 id="general-settings-heading" className="text-base font-semibold text-foreground">{t("title")}</h2>
      </div>

      {/* Theme */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-3">{t("theme")}</p>
        <div className="flex gap-2" role="radiogroup" aria-label={t("theme")}>
          {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
            <button
              key={value}
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                theme === value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                  : "border-border hover:border-muted-foreground/50 text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="timezone-select" className="block text-xs font-medium text-muted-foreground mb-1.5">
          <Clock className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
          {t("timezone")}
        </label>
        <select
          id="timezone-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
