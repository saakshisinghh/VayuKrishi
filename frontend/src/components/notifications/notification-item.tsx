"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CloudRain, Bug, TrendingUp, FileText, CheckSquare, Info, CheckCircle, AlertTriangle, AlertCircle, Archive, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";
import { formatRelativeTime } from "@/lib/utils/date";
import type { Notification, NotificationType, NotificationCategory } from "@/features/notifications/types";
import { cn } from "@/lib/utils/helpers";

const CATEGORY_ICONS: Record<NotificationCategory, React.ElementType> = {
  weather: CloudRain,
  disease: Bug,
  market: TrendingUp,
  scheme: FileText,
  task: CheckSquare,
  system: Info,
};

const TYPE_STYLES: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950/40" },
  success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950/40" },
  critical: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/40" },
};

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = memo(function NotificationItem({ notification }: NotificationItemProps) {
  const t = useTranslations("notifications");
  const { markRead, archiveNotification, removeNotification } = useNotificationStore();
  const CategoryIcon = CATEGORY_ICONS[notification.category];
  const typeStyle = TYPE_STYLES[notification.type];

  const handleMarkRead = useCallback(() => {
    if (!notification.read) markRead(notification.id);
  }, [notification.id, notification.read, markRead]);

  return (
    <article
      role="listitem"
      className={cn(
        "flex gap-3 px-5 py-4 border-b border-border/60 transition-colors hover:bg-muted/30 cursor-pointer",
        !notification.read && "bg-muted/20"
      )}
      onClick={handleMarkRead}
      aria-label={notification.title}
    >
      {/* Icon */}
      <div className={cn("w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5", typeStyle.bg)}>
        <CategoryIcon className={cn("w-4 h-4", typeStyle.color)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium text-foreground leading-snug", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" aria-label={t("unread")} />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
          {notification.body}
        </p>
        <div className="flex items-center justify-between mt-2">
          <time className="text-xs text-muted-foreground/70" dateTime={notification.createdAt}>
            {formatRelativeTime(notification.createdAt)}
          </time>
          <div className="flex items-center gap-1" role="group" aria-label={t("actions")}>
            <button
              onClick={(e) => { e.stopPropagation(); archiveNotification(notification.id); }}
              className="p-1 rounded hover:bg-muted transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={t("archive")}
            >
              <Archive className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
              className="p-1 rounded hover:bg-muted transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={t("delete")}
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
