"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { SearchResult } from "./search-result";
import { NAV_ITEMS } from "@/components/layout/sidebar/sidebar";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav.items");

  const results = query
    ? NAV_ITEMS.filter((item) => {
        let label = "";
        try { label = t(item.key as any); } catch { label = item.key; }
        return label.toLowerCase().includes(query.toLowerCase());
      }).map((item) => {
        let label = "";
        try { label = t(item.key as any); } catch { label = item.key; }
        return { ...item, label };
      })
    : [];

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(""); setActiveIndex(0); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[activeIndex]) {
        router.push(`/${locale}${results[activeIndex].href}`);
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, results, activeIndex, router, locale, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog" aria-label="Search" aria-modal="true"
            className="search-dialog"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="search-dialog__input-row">
              <Search size={17} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} aria-hidden="true" />
              <input
                ref={inputRef}
                className="search-dialog__input"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                placeholder="Search pages…"
                aria-label="Search pages"
                autoComplete="off"
              />
              {query && (
                <button className="search-dialog__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
              <kbd className="search-dialog__esc">ESC</kbd>
            </div>

            {results.length > 0 && (
              <div className="search-dialog__results" role="listbox" aria-label="Search results">
                {results.map((result, i) => (
                  <SearchResult
                    key={result.key} icon={result.icon} label={result.label}
                    href={`/${locale}${result.href}`} active={i === activeIndex}
                    onSelect={onClose} onMouseEnter={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="search-dialog__empty">No results for &ldquo;{query}&rdquo;</div>
            )}

            {!query && (
              <div className="search-dialog__hint">Type to search pages and features</div>
            )}
          </motion.div>
        </>
      )}

      <style jsx global>{`
        .search-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200;
        }
        .search-dialog {
          position: fixed; top: 18%; left: 50%; transform: translateX(-50%);
          width: min(560px, calc(100vw - 32px));
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 18px; box-shadow: 0 24px 64px rgba(0,0,0,0.2);
          z-index: 201; overflow: hidden;
        }
        .search-dialog__input-row {
          display: flex; align-items: center; gap: 10px; padding: 14px 16px;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .search-dialog__input {
          flex: 1; border: none; background: transparent;
          font-size: 15px; color: var(--color-text-primary);
          font-family: 'DM Sans', sans-serif; outline: none;
        }
        .search-dialog__input::placeholder { color: var(--color-text-muted); opacity: 0.6; }
        .search-dialog__clear {
          width: 24px; height: 24px; border-radius: 6px; border: none;
          background: var(--color-surface-hover); color: var(--color-text-muted);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .search-dialog__esc {
          font-size: 10px; padding: 2px 6px; border-radius: 5px;
          border: 1px solid var(--color-border-subtle); color: var(--color-text-muted);
          font-family: monospace; opacity: 0.6; flex-shrink: 0;
        }
        .search-dialog__results { padding: 8px; display: flex; flex-direction: column; gap: 1px; }
        .search-dialog__empty,
        .search-dialog__hint {
          padding: 20px 16px; font-size: 13px;
          color: var(--color-text-muted); font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </AnimatePresence>
  );
}
