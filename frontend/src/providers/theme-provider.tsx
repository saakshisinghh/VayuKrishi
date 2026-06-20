"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes' ThemeProvider so useTheme() (already called in
 * sonner.tsx and features/settings/components/general-settings.tsx)
 * actually has a context to read from.
 *
 * attribute="class" matches the existing `.dark { ... }` block in
 * src/app/globals.css — next-themes will toggle the `dark` class on
 * <html>, which is what those CSS variables already key off.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

