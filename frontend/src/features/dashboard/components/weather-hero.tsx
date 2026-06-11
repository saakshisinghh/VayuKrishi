"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Droplets, Wind, Eye, Thermometer, Sprout, CloudRain } from "lucide-react";
import type { WeatherData, WeatherCondition } from "../types/weather.types";

// ─── Weather Icon Map ─────────────────────────────────────────────────────────
function WeatherIcon({
  condition,
  className = "",
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const icons: Record<WeatherCondition, React.ReactNode> = {
    clear: (
      <motion.div
        className={`relative ${className}`}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="40" cy="40" r="16" fill="#FCD34D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={i}
              x1={40 + 22 * Math.cos((angle * Math.PI) / 180)}
              y1={40 + 22 * Math.sin((angle * Math.PI) / 180)}
              x2={40 + 30 * Math.cos((angle * Math.PI) / 180)}
              y2={40 + 30 * Math.sin((angle * Math.PI) / 180)}
              stroke="#FCD34D"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </svg>
      </motion.div>
    ),
    partly_cloudy: (
      <div className={`relative ${className}`}>
        <motion.div
          className="absolute inset-0"
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="28" cy="32" r="12" fill="#FCD34D" opacity="0.9" />
            <ellipse cx="48" cy="50" rx="20" ry="13" fill="white" opacity="0.95" />
            <ellipse cx="32" cy="52" rx="16" ry="12" fill="white" />
            <ellipse cx="58" cy="54" rx="12" ry="10" fill="white" opacity="0.8" />
          </svg>
        </motion.div>
      </div>
    ),
    cloudy: (
      <motion.div
        className={className}
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="40" cy="44" rx="28" ry="18" fill="#CBD5E1" />
          <ellipse cx="28" cy="40" rx="20" ry="15" fill="#CBD5E1" />
          <ellipse cx="54" cy="42" rx="18" ry="14" fill="#CBD5E1" />
          <ellipse cx="40" cy="48" rx="28" ry="14" fill="#E2E8F0" />
        </svg>
      </motion.div>
    ),
    rainy: (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="40" cy="32" rx="26" ry="16" fill="#94A3B8" />
          <ellipse cx="28" cy="28" rx="18" ry="13" fill="#94A3B8" />
          <ellipse cx="54" cy="30" rx="16" ry="12" fill="#94A3B8" />
          {[22, 32, 42, 52, 58].map((x, i) => (
            <motion.line
              key={i}
              x1={x} y1="50" x2={x - 4} y2="64"
              stroke="#60A5FA"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0], y: [0, 4, 8] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    ),
    thunderstorm: (
      <div className={className}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="40" cy="28" rx="28" ry="16" fill="#475569" />
          <motion.path
            d="M42 40 L34 55 L40 55 L32 70"
            stroke="#FDE047"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </svg>
      </div>
    ),
    foggy: (
      <div className={className}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[24, 32, 40, 48, 56].map((y, i) => (
            <motion.line
              key={i} x1="12" y1={y} x2="68" y2={y}
              stroke="#94A3B8" strokeWidth="4" strokeLinecap="round"
              animate={{ opacity: [0.3, 0.8, 0.3], x: [0, 4, 0] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    ),
    hazy: (
      <div className={className}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="40" cy="40" r="14" fill="#FCD34D" opacity="0.6" />
          {[24, 32, 48, 56].map((y, i) => (
            <motion.line
              key={i} x1="12" y1={y} x2="68" y2={y}
              stroke="#D4A574" strokeWidth="3" strokeLinecap="round" opacity="0.5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    ),
    windy: (
      <div className={className}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[24, 36, 48].map((y, i) => (
            <motion.path
              key={i}
              d={`M12 ${y} Q30 ${y - 8} 50 ${y} Q65 ${y + 6} 68 ${y}`}
              stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none"
              animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    ),
  };

  return <>{icons[condition] || icons.partly_cloudy}</>;
}

// ─── Sowing Window Badge ──────────────────────────────────────────────────────
const sowingColors = {
  open: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  optimal: "bg-green-500/20 text-green-300 border-green-500/30",
  marginal: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  closed: "bg-red-500/20 text-red-300 border-red-500/30",
};

// ─── Weekly Forecast Strip ────────────────────────────────────────────────────
function WeeklyForecast({ forecast }: { forecast: WeatherData["weeklyForecast"] }) {
  return (
    <div className="grid grid-cols-7 gap-1 mt-4">
      {forecast.map((day, i) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.05 }}
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="text-[11px] font-medium text-white/50">{day.date}</span>
          <WeatherIcon condition={day.condition} className="w-7 h-7" />
          <span className="text-[11px] font-semibold text-white/90">{day.high}°</span>
          <span className="text-[10px] text-white/40">{day.low}°</span>
          {day.rainProbability > 30 && (
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-blue-400" />
              <span className="text-[9px] text-blue-300">{day.rainProbability}%</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface WeatherHeroProps {
  data: WeatherData;
}

export function WeatherHero({ data }: WeatherHeroProps) {
  const t = useTranslations("dashboard.weather");

  const statItems = [
    { icon: Droplets, label: t("humidity"), value: `${data.humidity}%`, color: "text-blue-300" },
    { icon: Wind, label: t("wind"), value: `${data.windSpeed} km/h`, color: "text-slate-300" },
    { icon: CloudRain, label: t("rain"), value: `${data.rainProbability}%`, color: "text-indigo-300" },
    { icon: Eye, label: t("visibility"), value: `${data.visibility} km`, color: "text-purple-300" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
      }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-40%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FCD34D 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] left-[20%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between">
          {/* Left: location + main temp */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-1.5 mb-3"
            >
              <MapPin className="w-4 h-4 text-white/50" />
              <span className="text-sm font-medium text-white/70 tracking-wide">
                {data.location}, {data.state}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <span
                className="font-black text-white leading-none"
                style={{ fontSize: "clamp(56px, 8vw, 88px)" }}
              >
                {data.temperature}
              </span>
              <div className="pt-3">
                <span className="text-3xl font-light text-white/60">°C</span>
                <div className="text-sm text-white/40 mt-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  {t("feelsLike")} {data.feelsLike}°
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-light text-white/70 mt-1"
            >
              {data.conditionLabel}
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-5"
            >
              {statItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-white/50">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: animated weather icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 100 }}
            className="hidden md:block w-28 h-28 flex-shrink-0"
          >
            <WeatherIcon condition={data.condition} className="w-28 h-28" />
          </motion.div>
        </div>

        {/* Sowing recommendation banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm"
        >
          <Sprout className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white/90">{t("sowingWindow")}</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sowingColors[data.sowingWindow]}`}
              >
                {data.sowingWindow.toUpperCase()}
              </span>
              <span className="text-xs text-white/40 capitalize">
                {t("season")}: {data.season}
              </span>
            </div>
            <p className="text-sm text-white/60 mt-0.5 leading-snug">{data.sowingRecommendation}</p>
          </div>
        </motion.div>

        {/* Weekly forecast */}
        <WeeklyForecast forecast={data.weeklyForecast} />
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function WeatherSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-slate-800/50 animate-pulse" style={{ minHeight: 280 }}>
      <div className="p-6 md:p-8 space-y-4">
        <div className="h-4 w-32 bg-slate-700 rounded-full" />
        <div className="h-20 w-48 bg-slate-700 rounded-2xl" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-20 bg-slate-700 rounded-full" />
          ))}
        </div>
        <div className="h-16 bg-slate-700 rounded-2xl" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function WeatherError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("dashboard.weather");
  return (
    <div className="rounded-3xl bg-slate-800/50 border border-slate-700/50 p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <CloudRain className="w-7 h-7 text-red-400" />
      </div>
      <div>
        <p className="font-semibold text-white/80">{t("errorTitle")}</p>
        <p className="text-sm text-white/40 mt-1">{t("errorDesc")}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
