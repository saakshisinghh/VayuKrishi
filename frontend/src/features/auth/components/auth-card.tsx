// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/auth-card.tsx
// Shared card wrapper for all auth forms
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { type ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo-mark";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export function AuthCard({ children, title, subtitle, footer }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div className="auth-card__logo">
          <LogoMark size={32} />
          <span className="auth-card__logo-text">Vayukrishi</span>
        </div>
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      </div>

      <div className="auth-card__body">{children}</div>

      {footer && <div className="auth-card__footer">{footer}</div>}
    </div>
  );
}