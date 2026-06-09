"use client";

import { Menu } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { GlobalSearch } from "@/components/search/global-search";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ProfileDropdown } from "@/components/user/profile-dropdown";
import { useMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const isMobile = useMobile();

  return (
    <header className="navbar" role="banner">
      <div className="navbar__left">
        {isMobile && (
          <button className="navbar__icon-btn" onClick={onMenuClick} aria-label="Open navigation menu">
            <Menu size={20} />
          </button>
        )}
        <Breadcrumbs />
      </div>

      {!isMobile && (
        <div className="navbar__center">
          <GlobalSearch />
        </div>
      )}

      <div className="navbar__right">
        {isMobile && <GlobalSearch compact />}
        <ThemeSwitcher />
        <NotificationBell />
        <ProfileDropdown />
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: var(--color-navbar-bg, rgba(255,255,255,0.82));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--color-border-subtle);
          gap: 16px;
        }
        .navbar__left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          min-width: 0;
        }
        .navbar__center {
          flex: 1;
          max-width: 480px;
          margin: 0 auto;
        }
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .navbar__icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: none;
          background: transparent;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.14s;
        }
        .navbar__icon-btn:hover { background: var(--color-surface-hover); }
      `}</style>
    </header>
  );
}
