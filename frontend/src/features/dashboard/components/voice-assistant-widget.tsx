"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mic, MicOff, X, Sprout, CloudSun, ShoppingBasket, Bug } from "lucide-react";
import { useDashboardUIStore } from "../store/dashboard-ui-store";

// ─── Animated waveform bars ───────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8, 0.6];
  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((scale, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-emerald-400"
          animate={
            active
              ? {
                  scaleY: [scale * 0.3, scale, scale * 0.5, scale * 0.8, scale * 0.3],
                  opacity: [0.6, 1, 0.8, 1, 0.6],
                }
              : { scaleY: 0.15, opacity: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.8 + Math.random() * 0.4,
                  delay: i * 0.06,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          style={{ height: "100%", transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

// ─── Quick action chips ───────────────────────────────────────────────────────
const quickActions = [
  { icon: Sprout, labelKey: "whatToPlant", color: "text-emerald-400" },
  { icon: Bug, labelKey: "diseaseDetected", color: "text-orange-400" },
  { icon: CloudSun, labelKey: "weatherForecast", color: "text-blue-400" },
  { icon: ShoppingBasket, labelKey: "bestMarket", color: "text-amber-400" },
] as const;

// ─── Main widget ──────────────────────────────────────────────────────────────
export function VoiceAssistantWidget() {
  const t = useTranslations("dashboard.voice");
  const { isVoiceWidgetOpen, setVoiceWidgetOpen } = useDashboardUIStore();
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
        border: "1px solid rgba(52, 211, 153, 0.15)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08), transparent 70%)" }}
          animate={isRecording ? { scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] } : { scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 p-5">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white text-sm">{t("title")}</h2>
            <p className="text-xs text-white/40">{t("subtitle")}</p>
          </div>
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Mic button + waveform */}
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleRecording}
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              isRecording
                ? "bg-red-500/20 border border-red-500/40"
                : "bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/20"
            }`}
            aria-label={isRecording ? t("stopRecording") : t("startRecording")}
          >
            {/* Ripple when recording */}
            {isRecording && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-red-400/30"
                  animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-red-400/20"
                  animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, delay: 0.4, repeat: Infinity }}
                />
              </>
            )}
            {isRecording ? (
              <MicOff className="w-6 h-6 text-red-400" />
            ) : (
              <Mic className="w-6 h-6 text-emerald-400" />
            )}
          </motion.button>

          <div className="flex-1">
            {isRecording ? (
              <div className="space-y-1">
                <Waveform active={isRecording} />
                <p className="text-xs text-red-400 font-medium">{t("listening")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <Waveform active={false} />
                <p className="text-xs text-white/40">{t("tapToSpeak")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick action chips */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.labelKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/6 transition-colors text-left"
            >
              <action.icon className={`w-3.5 h-3.5 flex-shrink-0 ${action.color}`} />
              <span className="text-xs text-white/60 leading-snug">{t(action.labelKey)}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
