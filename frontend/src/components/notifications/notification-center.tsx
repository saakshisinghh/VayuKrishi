"use client";

import { useState, memo } from "react";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationDrawer } from "./notification-drawer";

export const NotificationCenter = memo(function NotificationCenter() {
  const t = useTranslations("notifications");
  const [open, setOpen] = useState(false);
  const unreadCount = useNotificationStore(
    (s) => s.notifications.filter((n) => !n.read && !n.archived).length
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={t("openAriaLabel", { count: unreadCount })}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-foreground" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
});
