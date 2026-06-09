"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  color?: string;
  loading?: boolean;
}

export function MetricCard({ title, value, unit, change, changeLabel, icon: Icon, color = "#2d6a4f", loading }: MetricCardProps) {
  const trend = change === undefined ? null : change > 0 ? "up" : change < 0 ? "down" : "neutral";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#94a3b8";

  if (loading) {
    return <div className="metric-card metric-card--skeleton" aria-busy="true" aria-label="Loading..." />;
  }

  return (
    <motion.div
      className="metric-card"
      whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
      transition={{ duration: 0.18 }}
    >
      <div className="metric-card__top">
        <span className="metric-card__title">{title}</span>
        {Icon && (
          <div className="metric-card__icon" style={{ background: `${color}15`, color }}>
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="metric-card__value-row">
        <span className="metric-card__value">{value}</span>
        {unit && <span className="metric-card__unit">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="metric-card__trend" style={{ color: trendColor }}>
          <TrendIcon size={13} strokeWidth={2.5} aria-hidden="true" />
          <span className="metric-card__change">{Math.abs(change)}%{changeLabel ? ` ${changeLabel}` : ""}</span>
        </div>
      )}

      <style jsx>{`
        .metric-card {
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: box-shadow 0.18s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .metric-card--skeleton {
          height: 120px;
          background: var(--color-skeleton-bg, rgba(0,0,0,0.05));
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .metric-card__top { display: flex; align-items: center; justify-content: space-between; }
        .metric-card__title {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-muted);
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .metric-card__icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-card__value-row { display: flex; align-items: baseline; gap: 4px; }
        .metric-card__value {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -1px;
          line-height: 1;
        }
        .metric-card__unit { font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
        .metric-card__trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </motion.div>
  );
}
