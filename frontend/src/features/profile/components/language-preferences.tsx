// language-preferences.tsx
"use client";

import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
] as const;

export function LanguagePreferences() {
  const t = useTranslations("profile.language");
  const { language, setLanguage } = useLanguageStore();

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="language-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
          <Globe className="w-4 h-4 text-purple-600" aria-hidden="true" />
        </div>
        <h2 id="language-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>

      <fieldset>
        <legend className="text-xs text-muted-foreground mb-3">{t("selectLanguage")}</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all ${
                language === lang.code
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={language === lang.code}
                onChange={() => setLanguage(lang.code as typeof lang.code)}
                className="sr-only"
              />
              <span className="text-lg" aria-hidden="true">
                {lang.code === "en" ? "🇬🇧" : lang.code === "hi" ? "🇮🇳" : lang.code === "mr" ? "🌾" : lang.code === "gu" ? "🦚" : lang.code === "ta" ? "🏛️" : "⭐"}
              </span>
              <span className="text-xs font-medium text-foreground">{lang.nativeLabel}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
