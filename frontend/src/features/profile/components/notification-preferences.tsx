// notification-preferences.tsx
"use client";

import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex-1 pr-4">
        <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          checked ? "bg-emerald-500" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function NotificationPreferences() {
  const t = useTranslations("profile.notificationPrefs");

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="notif-prefs-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
          <Bell className="w-4 h-4 text-amber-600" aria-hidden="true" />
        </div>
        <h2 id="notif-prefs-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{t("configureInSettings")}</p>
    </section>
  );
}
