"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard, Sprout, ScanLine, TrendingUp,
  HeartPulse, CalendarDays, Landmark, Mic2,
  BarChart2, User, Settings, LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sprout,
  ScanLine,
  TrendingUp,
  HeartPulse,
  CalendarDays,
  Landmark,
  Mic2,
  BarChart2,
  User,
  Settings,
};

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  actions?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ title, description, icon, iconColor = "#2d6a4f", actions, badge }: PageHeaderProps) {
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <motion.div
      className="page-header"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="page-header__left">
        {Icon && (
          <div className="page-header__icon" style={{ background: `${iconColor}18`, color: iconColor }}>
            <Icon size={22} strokeWidth={2} aria-hidden="true" />
          </div>
        )}
        <div>
          <div className="page-header__title-row">
            <h1 className="page-header__title">{title}</h1>
            {badge && <span className="page-header__badge">{badge}</span>}
          </div>
          {description && <p className="page-header__desc">{description}</p>}
        </div>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}

      <style jsx>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .page-header__left { display: flex; align-items: center; gap: 14px; }
        .page-header__icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .page-header__title-row { display: flex; align-items: center; gap: 10px; }
        .page-header__title { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: var(--color-text-primary); margin: 0; letter-spacing: -0.4px; line-height: 1.2; }
        .page-header__badge { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 600; background: var(--color-brand-green-alpha, rgba(45,106,79,0.1)); color: var(--color-brand-green, #2d6a4f); font-family: 'DM Sans', sans-serif; }
        .page-header__desc { margin: 3px 0 0; font-size: 14px; color: var(--color-text-muted); font-family: 'DM Sans', sans-serif; line-height: 1.5; }
        .page-header__actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      `}</style>
    </motion.div>
  );
}