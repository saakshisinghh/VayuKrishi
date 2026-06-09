"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard, Sprout, ScanLine, Mic2, TrendingUp,
  HeartPulse, CalendarDays, Landmark, BarChart3,
  UserCircle2, Settings, ChevronLeft, X, Leaf,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { SidebarGroup } from "./sidebar-group";
import { SidebarFooter } from "./sidebar-footer";
import { cn } from "@/lib/utils/helpers";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

export const NAV_ITEMS = [
  { key: "overview",             icon: LayoutDashboard, href: "/overview",            group: "main" },
  { key: "crop_recommendation",  icon: Sprout,          href: "/crop-recommendation", group: "farm" },
  { key: "disease_detection",    icon: ScanLine,        href: "/disease-detection",   group: "farm" },
  { key: "assistant",            icon: Mic2,            href: "/assistant",           group: "farm" },
  { key: "market",               icon: TrendingUp,      href: "/market",              group: "intelligence" },
  { key: "farm_health",          icon: HeartPulse,      href: "/farm-health",         group: "intelligence" },
  { key: "planner",              icon: CalendarDays,    href: "/planner",             group: "intelligence" },
  { key: "schemes",              icon: Landmark,        href: "/schemes",             group: "intelligence" },
  { key: "analytics",            icon: BarChart3,       href: "/analytics",           group: "tools" },
  { key: "profile",              icon: UserCircle2,     href: "/profile",             group: "tools" },
  { key: "settings",             icon: Settings,        href: "/settings",            group: "tools" },
];

export function Sidebar({ collapsed, onCollapse, mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const isActive = (href: string) => pathname.includes(href);

  const grouped = {
    main:         NAV_ITEMS.filter((i) => i.group === "main"),
    farm:         NAV_ITEMS.filter((i) => i.group === "farm"),
    intelligence: NAV_ITEMS.filter((i) => i.group === "intelligence"),
    tools:        NAV_ITEMS.filter((i) => i.group === "tools"),
  };

  const isCollapsed = collapsed && !mobile;

  return (
    <aside
      className={cn("sidebar", isCollapsed && "sidebar--collapsed")}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="sidebar__header">
        <Link href={`/${locale}/overview`} className="sidebar__logo" aria-label="Vayukrishi home">
          <div className="sidebar__logo-icon">
            <Leaf size={18} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <motion.span
              className="sidebar__logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Vayukrishi
            </motion.span>
          )}
        </Link>

        {mobile ? (
          <button className="sidebar__btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        ) : (
          <button
            className={cn("sidebar__btn", isCollapsed && "sidebar__btn--flipped")}
            onClick={onCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        <SidebarGroup label={t("groups.main")} collapsed={isCollapsed}>
          {grouped.main.map((item) => (
            <SidebarItem key={item.key} href={`/${locale}${item.href}`} icon={item.icon}
              label={t(`items.${item.key}`)} active={isActive(item.href)} collapsed={isCollapsed} />
          ))}
        </SidebarGroup>

        <SidebarGroup label={t("groups.farm")} collapsed={isCollapsed}>
          {grouped.farm.map((item) => (
            <SidebarItem key={item.key} href={`/${locale}${item.href}`} icon={item.icon}
              label={t(`items.${item.key}`)} active={isActive(item.href)} collapsed={isCollapsed} />
          ))}
        </SidebarGroup>

        <SidebarGroup label={t("groups.intelligence")} collapsed={isCollapsed}>
          {grouped.intelligence.map((item) => (
            <SidebarItem key={item.key} href={`/${locale}${item.href}`} icon={item.icon}
              label={t(`items.${item.key}`)} active={isActive(item.href)} collapsed={isCollapsed} />
          ))}
        </SidebarGroup>

        <SidebarGroup label={t("groups.tools")} collapsed={isCollapsed}>
          {grouped.tools.map((item) => (
            <SidebarItem key={item.key} href={`/${locale}${item.href}`} icon={item.icon}
              label={t(`items.${item.key}`)} active={isActive(item.href)} collapsed={isCollapsed} />
          ))}
        </SidebarGroup>
      </nav>

      <SidebarFooter collapsed={isCollapsed} />

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          background: var(--color-sidebar-bg, rgba(255,255,255,0.88));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid var(--color-border-subtle);
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          z-index: 30;
          flex-shrink: 0;
        }
        .sidebar--collapsed { width: 72px; }
        .sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px 16px;
          min-height: 64px;
          flex-shrink: 0;
        }
        .sidebar__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          overflow: hidden;
          min-width: 0;
        }
        .sidebar__logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--color-brand-green, #2d6a4f);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(45,106,79,0.3);
        }
        .sidebar__logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 17px;
          color: var(--color-text-primary);
          letter-spacing: -0.3px;
          white-space: nowrap;
        }
        .sidebar__btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: 1px solid var(--color-border-subtle);
          background: transparent;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar__btn:hover { background: var(--color-surface-hover); color: var(--color-text-primary); }
        .sidebar__btn--flipped { transform: rotate(180deg); }
        .sidebar__nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-subtle) transparent;
        }
        .sidebar__nav::-webkit-scrollbar { width: 4px; }
        .sidebar__nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar__nav::-webkit-scrollbar-thumb { background: var(--color-border-subtle); border-radius: 99px; }
      `}</style>
    </aside>
  );
}
