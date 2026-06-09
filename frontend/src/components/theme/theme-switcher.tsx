"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  const isDark = theme === "dark";
  return (
    <button
      className="theme-switcher"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      <style jsx>{`
        .theme-switcher {
          width: 36px; height: 36px; border-radius: 9px; border: none;
          background: transparent; color: var(--color-text-primary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.14s;
        }
        .theme-switcher:hover { background: var(--color-surface-hover); }
        .theme-switcher:focus-visible { outline: 2px solid var(--color-brand-green); outline-offset: 1px; }
      `}</style>
    </button>
  );
}
