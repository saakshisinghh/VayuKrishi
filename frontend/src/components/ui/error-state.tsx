"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      className="error-state"
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="error-state__icon">
        <AlertTriangle size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h3 className="error-state__title">{title ?? "Something went wrong"}</h3>
      <p className="error-state__message">{message ?? "An unexpected error occurred. Please try again."}</p>
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry} aria-label="Try again">
          <RefreshCcw size={14} strokeWidth={2.5} aria-hidden="true" />
          Try again
        </button>
      )}

      <style jsx>{`
        .error-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 48px 24px; gap: 10px; text-align: center;
        }
        .error-state__icon {
          width: 60px; height: 60px; border-radius: 18px;
          background: rgba(239,68,68,0.1); color: #ef4444;
          display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
        }
        .error-state__title {
          font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700;
          color: var(--color-text-primary); margin: 0;
        }
        .error-state__message {
          font-size: 14px; color: var(--color-text-muted); margin: 0;
          font-family: 'DM Sans', sans-serif; max-width: 300px; line-height: 1.5;
        }
        .error-state__retry {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
          padding: 9px 18px; border-radius: 9px;
          border: 1px solid var(--color-border-default); background: transparent;
          color: var(--color-text-primary); font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.14s;
        }
        .error-state__retry:hover { background: var(--color-surface-hover); }
        .error-state__retry:focus-visible { outline: 2px solid var(--color-brand-green); outline-offset: 2px; }
      `}</style>
    </motion.div>
  );
}
