"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

interface SearchResultProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

export function SearchResult({ icon: Icon, label, href, active, onSelect, onMouseEnter }: SearchResultProps) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={active}
      className={cn("search-result", active && "search-result--active")}
    >
      <div className="search-result__icon">
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </div>
      <span className="search-result__label">{label}</span>

      <style jsx>{`
        :global(.search-result) {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 9px; text-decoration: none; color: var(--color-text-primary);
          transition: background 0.12s;
        }
        :global(.search-result--active) { background: var(--color-brand-green-alpha, rgba(45,106,79,0.1)); }
        .search-result__icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--color-surface-hover);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-brand-green, #2d6a4f); flex-shrink: 0;
          transition: background 0.12s, color 0.12s;
        }
        :global(.search-result--active) .search-result__icon {
          background: var(--color-brand-green, #2d6a4f); color: #fff;
        }
        .search-result__label { font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; }
      `}</style>
    </Link>
  );
}
