"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, icon: Icon, label, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("sidebar-item", active && "sidebar-item--active")}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
    >
      <span className="sidebar-item__icon">
        <Icon size={18} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
      </span>

      {!collapsed && (
        <motion.span
          className="sidebar-item__label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          {label}
        </motion.span>
      )}

      {active && (
        <motion.span
          className="sidebar-item__indicator"
          layoutId="sidebar-active"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <style jsx>{`
        :global(.sidebar-item) {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 9px;
          text-decoration: none;
          color: var(--color-text-muted);
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.14s, color 0.14s;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        :global(.sidebar-item:hover) {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }
        :global(.sidebar-item:focus-visible) {
          outline: 2px solid var(--color-brand-green);
          outline-offset: 1px;
          border-radius: 9px;
        }
        :global(.sidebar-item--active) {
          background: var(--color-brand-green-alpha, rgba(45,106,79,0.1));
          color: var(--color-brand-green, #2d6a4f);
        }
        :global(.sidebar-item__icon) {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        :global(.sidebar-item__label) {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :global(.sidebar-item__indicator) {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-brand-green, #2d6a4f);
          flex-shrink: 0;
        }
      `}</style>
    </Link>
  );
}
