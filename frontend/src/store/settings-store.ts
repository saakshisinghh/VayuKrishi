import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSettings {
  weather: boolean;
  disease: boolean;
  market: boolean;
  scheme: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  accountVisibility: boolean;
}

interface SettingsState {
  timezone: string;
  voiceLanguage: string;
  speechSpeed: number;
  audioQuality: "low" | "medium" | "high";
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  setTimezone: (tz: string) => void;
  setVoiceLanguage: (lang: string) => void;
  setSpeechSpeed: (speed: number) => void;
  setAudioQuality: (quality: "low" | "medium" | "high") => void;
  toggleNotificationSetting: (key: keyof NotificationSettings) => void;
  togglePrivacySetting: (key: keyof PrivacySettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      timezone: "Asia/Kolkata",
      voiceLanguage: "hi",
      speechSpeed: 1,
      audioQuality: "medium",
      notificationSettings: {
        weather: true,
        disease: true,
        market: true,
        scheme: true,
      },
      privacySettings: {
        dataSharing: false,
        analytics: true,
        accountVisibility: false,
      },
      setTimezone: (timezone) => set({ timezone }),
      setVoiceLanguage: (voiceLanguage) => set({ voiceLanguage }),
      setSpeechSpeed: (speechSpeed) => set({ speechSpeed }),
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      toggleNotificationSetting: (key) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            [key]: !state.notificationSettings[key],
          },
        })),
      togglePrivacySetting: (key) =>
        set((state) => ({
          privacySettings: {
            ...state.privacySettings,
            [key]: !state.privacySettings[key],
          },
        })),
    }),
    { name: "vayukrishi-settings" }
  )
);
