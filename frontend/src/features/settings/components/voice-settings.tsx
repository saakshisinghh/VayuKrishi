// voice-settings.tsx
"use client";

import { useTranslations } from "next-intl";
import { Mic } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";

const VOICE_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export function VoiceSettings() {
  const t = useTranslations("settings.voice");
  const { voiceLanguage, speechSpeed, audioQuality, setVoiceLanguage, setSpeechSpeed, setAudioQuality } = useSettingsStore();

  return (
    <section className="rounded-xl border border-border bg-card p-6" aria-labelledby="voice-settings-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
          <Mic className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>
        <h2 id="voice-settings-heading" className="text-base font-semibold text-foreground">{t("title")}</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="voice-lang" className="block text-xs font-medium text-muted-foreground mb-1.5">{t("voiceLanguage")}</label>
          <select id="voice-lang" value={voiceLanguage} onChange={(e) => setVoiceLanguage(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {VOICE_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="speech-speed" className="block text-xs font-medium text-muted-foreground mb-1.5">
            {t("speechSpeed")}: <span className="text-foreground font-semibold">{speechSpeed}x</span>
          </label>
          <input id="speech-speed" type="range" min={0.5} max={2} step={0.25} value={speechSpeed}
            onChange={(e) => setSpeechSpeed(Number(e.target.value))}
            className="w-full accent-emerald-500" aria-valuemin={0.5} aria-valuemax={2} aria-valuenow={speechSpeed} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.5x</span><span>1x</span><span>2x</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">{t("audioQuality")}</p>
          <div className="flex gap-2" role="radiogroup" aria-label={t("audioQuality")}>
            {(["low", "medium", "high"] as const).map((q) => (
              <button key={q} role="radio" aria-checked={audioQuality === q}
                onClick={() => setAudioQuality(q)}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  audioQuality === q ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700" : "border-border text-muted-foreground hover:border-muted-foreground/50"
                }`}
              >
                {t(q)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
