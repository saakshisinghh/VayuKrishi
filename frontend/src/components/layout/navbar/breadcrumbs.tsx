"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav.items");

  const stripped = pathname.replace(`/${locale}`, "");
  const segments = stripped.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = `/${locale}/${segments.slice(0, i + 1).join("/")}`;
    const key = seg.replace(/-/g, "_");
    let label: string;
    try { label = t(key as any); } catch { label = seg.replace(/-/g, " "); }
    return { label, href };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumbs">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="breadcrumbs__item">
              {i > 0 && <ChevronRight size={13} className="breadcrumbs__sep" aria-hidden="true" />}
              {isLast ? (
                <span className="breadcrumbs__current" aria-current="page">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="breadcrumbs__link">{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
      <style jsx>{`
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .breadcrumbs__item {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        :global(.breadcrumbs__sep) { color: var(--color-text-muted); opacity: 0.5; }
        :global(.breadcrumbs__link) {
          font-size: 13.5px;
          color: var(--color-text-muted);
          text-decoration: none;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.14s;
        }
        :global(.breadcrumbs__link:hover) { color: var(--color-text-primary); }
        .breadcrumbs__current {
          font-size: 13.5px;
          color: var(--color-text-primary);
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </nav>
  );
}
