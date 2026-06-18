"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, Bell, CheckCheck, Trash2, Archive } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationItem } from "./notification-item";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/features/notifications/types";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer = memo(function NotificationDrawer({
  open,
  onClose,
}: NotificationDrawerProps) {
  const t = useTranslations("notifications");
  const { notifications, markAllRead, clearAll } = useNotificationStore();

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
  }, [markAllRead]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        role="complementary"
        aria-label={t("drawerAriaLabel")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">{t("title")}</h2>
            {unreadCount > 0 && (
              <span
                className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                aria-label={t("unreadCount", { count: unreadCount })}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("close")}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs gap-1.5"
              aria-label={t("markAllRead")}
            >
              <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {t("markAllRead")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs gap-1.5 text-destructive hover:text-destructive"
              aria-label={t("clearAll")}
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              {t("clearAll")}
            </Button>
          </div>
        )}

        {/* Notification List */}
        <div
          className="flex-1 overflow-y-auto"
          role="list"
          aria-label={t("notificationList")}
        >
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <Bell className="w-12 h-12 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
});
