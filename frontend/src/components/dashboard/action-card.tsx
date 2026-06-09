"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
}

export function ActionCard({ title, description, href, icon: Icon, color = "#2d6a4f", badge }: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="action-card">
        <div className="action-card__icon" style={{ background: `${color}18`, color }}>
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="action-card__content">
          <div className="action-card__title-row">
            <span className="action-card__title">{title}</span>
            {badge && <span className="action-card__badge" style={{ background: `${color}18`, color }}>{badge}</span>}
          </div>
          <p className="action-card__desc">{description}</p>
        </div>
        <ArrowRight size={16} className="action-card__arrow" aria-hidden="true" />
      </Link>

      <style jsx>{`
        :global(.action-card) {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: border-color 0.18s;
        }
        :global(.action-card:hover) { border-color: var(--color-brand-green, #2d6a4f); }
        :global(.action-card:focus-visible) { outline: 2px solid var(--color-brand-green); outline-offset: 2px; }
        .action-card__icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .action-card__content { flex: 1; min-width: 0; }
        .action-card__title-row { display: flex; align-items: center; gap: 7px; }
        .action-card__title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--color-text-primary);
          font-family: 'DM Sans', sans-serif;
        }
        .action-card__badge {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 99px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .action-card__desc {
          font-size: 12.5px;
          color: var(--color-text-muted);
          margin: 1px 0 0;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        :global(.action-card__arrow) {
          color: var(--color-text-muted);
          flex-shrink: 0;
          transition: transform 0.18s, color 0.18s;
        }
        :global(.action-card:hover .action-card__arrow) {
          transform: translateX(3px);
          color: var(--color-brand-green, #2d6a4f);
        }
      `}</style>
    </motion.div>
  );
}
