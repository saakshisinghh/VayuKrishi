"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "./focus-trap";
import { useTranslations } from "next-intl";

interface AccessibleDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

/**
 * AccessibleDialog — WCAG 2.1 AA compliant modal dialog.
 * - role="dialog" with aria-modal
 * - aria-labelledby and aria-describedby wired up
 * - Focus trapped inside
 * - Escape closes
 * - Backdrop click closes
 * - Body scroll locked when open
 */
export function AccessibleDialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: AccessibleDialogProps) {
  const t = useTranslations("a11y");
  const titleId = useId();
  const descId = useId();

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <FocusTrap active={open} onEscape={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          className={`
            relative bg-background rounded-2xl border border-border shadow-2xl
            w-full ${SIZE_CLASSES[size]}
            flex flex-col max-h-[90vh]
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-border flex-shrink-0">
            <div>
              <h2 id={titleId} className="text-base font-semibold text-foreground">
                {title}
              </h2>
              {description && (
                <p id={descId} className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0"
              aria-label={t("closeDialog")}
            >
              <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </FocusTrap>
    </div>
  );
}
