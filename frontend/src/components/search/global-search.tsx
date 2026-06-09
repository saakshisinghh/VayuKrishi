"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "./search-dialog";

interface GlobalSearchProps {
  compact?: boolean;
}

export function GlobalSearch({ compact }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (compact) {
    return (
      <>
        <button className="search-compact" onClick={() => setOpen(true)} aria-label="Search pages">
          <Search size={19} strokeWidth={2} />
          <SearchDialog open={open} onClose={() => setOpen(false)} />
        </button>
        <style jsx>{`
          .search-compact {
            width: 36px; height: 36px; border-radius: 9px; border: none;
            background: transparent; color: var(--color-text-primary);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.14s;
          }
          .search-compact:hover { background: var(--color-surface-hover); }
        `}</style>
      </>
    );
  }

  return (
    <>
      <button
        className="global-search"
        onClick={() => setOpen(true)}
        aria-label="Search pages"
        role="search"
      >
        <Search size={15} className="global-search__icon" aria-hidden="true" />
        <span className="global-search__placeholder">Search pages…</span>
        <kbd className="global-search__kbd">⌘K</kbd>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />

      <style jsx>{`
        .global-search {
          display: flex; align-items: center; gap: 8px;
          width: 100%; max-width: 420px; height: 38px; padding: 0 12px;
          border-radius: 10px; border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-soft, rgba(0,0,0,0.03));
          cursor: pointer; transition: border-color 0.14s, background 0.14s;
          color: var(--color-text-muted);
        }
        .global-search:hover { border-color: var(--color-border-default); background: var(--color-surface-hover); }
        .global-search:focus-visible { outline: 2px solid var(--color-brand-green); outline-offset: 1px; }
        :global(.global-search__icon) { flex-shrink: 0; opacity: 0.6; }
        .global-search__placeholder { flex: 1; text-align: left; font-size: 13.5px; font-family: 'DM Sans', sans-serif; }
        .global-search__kbd {
          flex-shrink: 0; font-size: 10.5px; padding: 2px 6px;
          border-radius: 5px; border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-soft); font-family: monospace;
          color: var(--color-text-muted); opacity: 0.7;
        }
      `}</style>
    </>
  );
}
