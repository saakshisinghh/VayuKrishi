"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "../queries/dashboard.query";

interface DashboardHeaderProps {
  farmerName?: string;
}

function getGreeting(t: ReturnType<typeof useTranslations>) {
  const hour = new Date().getHours();
  if (hour < 12) return t("goodMorning");
  if (hour < 17) return t("goodAfternoon");
  return t("goodEvening");
}

export function DashboardHeader({ farmerName = "Farmer" }: DashboardHeaderProps) {
  const t = useTranslations("dashboard.header");
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {getGreeting(t)},{" "}
          <span className="text-emerald-400">{farmerName}</span> 👋
        </h1>
        <p className="text-sm text-white/40 mt-1">{today}</p>
      </div>

      <motion.button
        whileTap={{ rotate: 180 }}
        transition={{ duration: 0.4 }}
        onClick={handleRefresh}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center transition-colors mt-1"
        aria-label={t("refresh")}
      >
        <RefreshCw className="w-4 h-4 text-white/50" />
      </motion.button>
    </motion.div>
  );
}
