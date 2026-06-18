// skip-to-content.tsx
"use client";

import { useTranslations } from "next-intl";

/**
 * SkipToContent — renders an off-screen link that appears on focus.
 * Place at the very top of layout.tsx, before the navbar.
 */
export function SkipToContent() {
  const t = useTranslations("a11y");
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-2 left-2 z-[9999]
        bg-emerald-600 text-white
        px-4 py-2 rounded-lg
        text-sm font-semibold
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white
        transition-transform
      "
    >
      {t("skipToContent")}
    </a>
  );
}
