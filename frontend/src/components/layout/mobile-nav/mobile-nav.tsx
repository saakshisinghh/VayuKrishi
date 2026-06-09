"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LayoutDashboard, Mic2, TrendingUp, ScanLine, UserCircle2 } from "lucide-react";

const ITEMS = [
  { key: "overview",          icon: LayoutDashboard, href: "/overview" },
  { key: "assistant",         icon: Mic2,            href: "/assistant" },
  { key: "market",            icon: TrendingUp,      href: "/market" },
  { key: "disease_detection", icon: ScanLine,        href: "/disease-detection" },
  { key: "profile",           icon: UserCircle2,     href: "/profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav.items");

  return (
    <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
      {ITEMS.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = pathname.includes(item.href);
        return (
          <Link
            key={item.key}
            href={href}
            className={`mobile-nav__item${active ? " mobile-nav__item--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.div
                className="mobile-nav__indicator"
                layoutId="mobile-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <item.icon size={21} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
            <span className="mobile-nav__label">{t(item.key as any)}</span>
          </Link>
        );
      })}

      <style jsx>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 68px;
          display: flex;
          align-items: stretch;
          background: var(--color-navbar-bg, rgba(255,255,255,0.92));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--color-border-subtle);
          z-index: 40;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        :global(.mobile-nav__item) {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none;
          color: var(--color-text-muted);
          font-size: 10px;
          font-weight: 500;
          position: relative;
          transition: color 0.14s;
          padding-top: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        :global(.mobile-nav__item--active) { color: var(--color-brand-green, #2d6a4f); }
        .mobile-nav__indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: var(--color-brand-green, #2d6a4f);
          border-radius: 0 0 3px 3px;
        }
        :global(.mobile-nav__label) { line-height: 1; }
      `}</style>
    </nav>
  );
}
