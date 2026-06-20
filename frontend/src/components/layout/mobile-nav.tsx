"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  LayoutDashboard,
  Sprout,
  Bug,
  Mic2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile nav intentionally shows a curated subset (5 items max fits a
 * thumb-reachable bottom bar) rather than all 9 MAIN_NAV_ITEMS. The
 * full list remains reachable via the sidebar on desktop, and via the
 * profile/settings links exposed elsewhere on mobile.
 */
const MOBILE_NAV_ITEMS: { key: string; href: string; icon: LucideIcon; translationKey: string }[] = [
  { key: "dashboard", href: "/overview", icon: LayoutDashboard, translationKey: "dashboard" },
  { key: "cropRecommendation", href: "/crop-recommendation", icon: Sprout, translationKey: "cropRecommendation" },
  { key: "assistant", href: "/assistant", icon: Mic2, translationKey: "assistant" },
  { key: "market", href: "/market", icon: TrendingUp, translationKey: "market" },
  { key: "diseaseDetection", href: "/disease-detection", icon: Bug, translationKey: "diseaseDetection" },
];

export function MobileNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-white/8 bg-[#080f1c]/95 backdrop-blur lg:hidden"
      aria-label={t("dashboard")}
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const href = `/${locale}${item.href}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-400" : "text-white/40"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate px-1">{t(item.translationKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

