"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle2, Globe, Sun, Settings, LogOut, ChevronDown } from "lucide-react";
import { UserAvatar } from "./user-avatar";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { label: "Profile",  icon: UserCircle2, href: `/${locale}/profile` },
    { label: "Language", icon: Globe,       href: `/${locale}/settings?tab=language` },
    { label: "Theme",    icon: Sun,         href: `/${locale}/settings?tab=theme` },
    { label: "Settings", icon: Settings,    href: `/${locale}/settings` },
  ];

  return (
    <div className="profile-dropdown" ref={ref}>
      <button
        className="profile-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <UserAvatar name="Arjun Patel" size={30} />
        <span className="profile-dropdown__name">Arjun</span>
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-dropdown__menu"
            role="menu" aria-label="User menu"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <div className="profile-dropdown__user-info">
              <UserAvatar name="Arjun Patel" size={36} />
              <div>
                <div className="profile-dropdown__user-name">Arjun Patel</div>
                <div className="profile-dropdown__user-email">arjun@farm.in</div>
              </div>
            </div>
            <div className="profile-dropdown__divider" />
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} className="profile-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>
                <item.icon size={15} strokeWidth={2} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="profile-dropdown__divider" />
            <button className="profile-dropdown__item profile-dropdown__item--danger" role="menuitem">
              <LogOut size={15} strokeWidth={2} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .profile-dropdown { position: relative; }
        .profile-dropdown__trigger {
          display: flex; align-items: center; gap: 7px;
          padding: 4px 8px 4px 4px; border-radius: 10px;
          border: 1px solid var(--color-border-subtle); background: transparent;
          cursor: pointer; color: var(--color-text-primary); transition: background 0.14s;
        }
        .profile-dropdown__trigger:hover { background: var(--color-surface-hover); }
        .profile-dropdown__name { font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .profile-dropdown__menu {
          position: absolute; top: calc(100% + 10px); right: 0; width: 220px;
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.14);
          padding: 8px; z-index: 100;
        }
        .profile-dropdown__user-info { display: flex; align-items: center; gap: 10px; padding: 8px 8px 10px; }
        .profile-dropdown__user-name { font-size: 13.5px; font-weight: 700; color: var(--color-text-primary); font-family: 'DM Sans', sans-serif; }
        .profile-dropdown__user-email { font-size: 11.5px; color: var(--color-text-muted); font-family: 'DM Sans', sans-serif; }
        .profile-dropdown__divider { height: 1px; background: var(--color-border-subtle); margin: 4px 0; }
        :global(.profile-dropdown__item) {
          display: flex; align-items: center; gap: 9px; padding: 9px 10px;
          border-radius: 8px; font-size: 13.5px; font-weight: 500;
          color: var(--color-text-secondary); font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer; border: none;
          background: transparent; width: 100%; text-align: left;
          transition: background 0.13s, color 0.13s;
        }
        :global(.profile-dropdown__item:hover) { background: var(--color-surface-hover); color: var(--color-text-primary); }
        :global(.profile-dropdown__item--danger) { color: #ef4444; }
        :global(.profile-dropdown__item--danger:hover) { background: rgba(239,68,68,0.08); color: #ef4444; }
      `}</style>
    </div>
  );
}
