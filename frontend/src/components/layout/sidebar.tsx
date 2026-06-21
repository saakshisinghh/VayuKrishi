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
  HeartPulse,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { MAIN_NAV_ITEMS, BOTTOM_NAV_ITEMS, type NavItem } from "@/config/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/lib/queries/auth";
import { cn } from "@/lib/utils";

/**
 * Maps NavItem.iconName (a plain string, kept that way so navigation.ts
 * can stay a Server-Component-safe config file) to the actual lucide
 * icon component.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sprout,
  Bug,
  Mic2,
  TrendingUp,
  HeartPulse,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
};

function NavLink({ item, locale, pathname }: { item: NavItem; locale: string; pathname: string }) {
  const t = useTranslations("nav");
  const Icon = ICON_MAP[item.iconName] ?? LayoutDashboard;
  const href = `/${locale}${item.href}`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  // translationKey is stored as "nav.xxx" in config; strip the "nav." prefix
  // since useTranslations("nav") is already scoped to that namespace.
  const key = item.translationKey.replace(/^nav\./, "");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-emerald-500/15 text-emerald-400"
          : "text-white/50 hover:bg-white/5 hover:text-white/90"
      )}
    >
      <Icon className="h-[18px] w-[18px] flex-shrink-0" />
      <span className="truncate">{t(key)}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  // useLogout() (lib/queries/auth.ts) calls the backend /auth/logout
  // endpoint — which clears the httpOnly refreshToken cookie server-side —
  // AND clears local Zustand state, then redirects. Calling
  // useAuthStore().logout() directly here would only wipe local memory;
  // the refreshToken cookie would survive, and AuthProvider's automatic
  // refreshSession() on the next page load would silently log the user
  // back in, making "Log out" appear to do nothing.
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/8 bg-[#080f1c] lg:flex"
      aria-label={t("dashboard")}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
          <Sprout className="h-[18px] w-[18px]" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Vayukrishi</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink key={item.key} item={item} locale={locale} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom nav + user */}
      <div className="space-y-1 border-t border-white/8 px-3 py-3">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavLink key={item.key} item={item} locale={locale} pathname={pathname} />
        ))}

        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <div className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/70">
            {(user?.name ?? "F").charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{user?.name ?? t("profile")}</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}