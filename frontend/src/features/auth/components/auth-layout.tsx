// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/components/auth-layout.tsx
// Full-page split layout for auth screens
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import "@/styles/auth.css";



import { type ReactNode } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface AuthLayoutProps {
  children: ReactNode;
}

const TESTIMONIALS = [
  {
    quote: "auth.testimonial_1_quote",
    author: "auth.testimonial_1_author",
    location: "auth.testimonial_1_location",
  },
  {
    quote: "auth.testimonial_2_quote",
    author: "auth.testimonial_2_author",
    location: "auth.testimonial_2_location",
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const locale = useLocale();

  return (
    <div className="auth-layout">
      {/* ── Left Panel — illustration & brand ── */}
      <aside className="auth-layout__panel" aria-hidden="true">
        <div className="auth-layout__panel-inner">
          {/* Decorative field illustration via CSS */}
          <div className="auth-layout__illustration">
            <div className="auth-layout__illustration-field" />
            <div className="auth-layout__illustration-sun" />
            <div className="auth-layout__illustration-crop auth-layout__illustration-crop--1" />
            <div className="auth-layout__illustration-crop auth-layout__illustration-crop--2" />
            <div className="auth-layout__illustration-crop auth-layout__illustration-crop--3" />
          </div>

          <div className="auth-layout__brand">
            <p className="auth-layout__brand-tagline">
              Smart farming for Bharat&apos;s future
            </p>
          </div>

          <blockquote className="auth-layout__testimonial">
            <p className="auth-layout__testimonial-quote">
              &ldquo;Vayukrishi ने मेरी फसल की पैदावार 40% बढ़ा दी।&rdquo;
            </p>
            <footer className="auth-layout__testimonial-author">
              <span>Ramesh Patel</span>
              <span className="auth-layout__testimonial-location">
                Vidarbha, Maharashtra
              </span>
            </footer>
          </blockquote>

          {/* Floating stat cards */}
          <div className="auth-layout__stats">
            <div className="auth-layout__stat">
              <span className="auth-layout__stat-value">2.4L+</span>
              <span className="auth-layout__stat-label">Farmers</span>
            </div>
            <div className="auth-layout__stat">
              <span className="auth-layout__stat-value">18</span>
              <span className="auth-layout__stat-label">States</span>
            </div>
            <div className="auth-layout__stat">
              <span className="auth-layout__stat-value">94%</span>
              <span className="auth-layout__stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right Panel — form ── */}
      <main className="auth-layout__form-panel">
        <nav className="auth-layout__topbar">
          <Link href={`/${locale}`} className="auth-layout__home-link">
            ← Back to home
          </Link>
        </nav>
        <div className="auth-layout__form-wrapper">{children}</div>
      </main>
    </div>
  );
}

