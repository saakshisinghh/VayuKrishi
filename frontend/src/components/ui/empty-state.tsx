"use client";

import { motion } from "framer-motion";
import { LucideIcon, Sprout, ScanLine, BarChart3, Bell } from "lucide-react";

type EmptyVariant = "no_crops" | "no_disease" | "no_forecast" | "no_notifications" | "custom";

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

const variants: Record<Exclude<EmptyVariant, "custom">, { icon: LucideIcon; color: string; title: string; description: string }> = {
  no_crops:          { icon: Sprout,    color: "#2d6a4f", title: "No crops added",      description: "Add your first crop to get personalised recommendations." },
  no_disease:        { icon: ScanLine,  color: "#e67e22", title: "No disease reports",  description: "Upload a photo of your crop to detect diseases early." },
  no_forecast:       { icon: BarChart3, color: "#3b82f6", title: "No forecast data",    description: "Forecast data will appear once your farm profile is complete." },
  no_notifications:  { icon: Bell,      color: "#8b5cf6", title: "All caught up",        description: "No new notifications right now." },
};

export function EmptyState({ variant = "custom", title, description, icon: CustomIcon, action }: EmptyStateProps) {
  const cfg = variant !== "custom" ? variants[variant] : null;
  const Icon = CustomIcon ?? cfg?.icon ?? Sprout;
  const color = cfg?.color ?? "#2d6a4f";
  const displayTitle = title ?? cfg?.title ?? "Nothing here";
  const displayDesc = description ?? cfg?.description ?? "";

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28 }}
    >
      <div className="empty-state__icon" style={{ background: `${color}15`, color }}>
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="empty-state__title">{displayTitle}</h3>
      {displayDesc && <p className="empty-state__desc">{displayDesc}</p>}
      {action && <div className="empty-state__action">{action}</div>}

      <style jsx>{`
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 56px 24px; gap: 12px; text-align: center;
        }
        .empty-state__icon {
          width: 64px; height: 64px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
        }
        .empty-state__title {
          font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700;
          color: var(--color-text-primary); margin: 0; letter-spacing: -0.2px;
        }
        .empty-state__desc {
          font-size: 14px; color: var(--color-text-muted); margin: 0;
          font-family: 'DM Sans', sans-serif; max-width: 320px; line-height: 1.5;
        }
        .empty-state__action { margin-top: 8px; }
      `}</style>
    </motion.div>
  );
}
