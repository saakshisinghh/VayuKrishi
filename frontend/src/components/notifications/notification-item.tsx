"use client";

import Link from "next/link";
import { X, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Notification, useNotificationStore } from "@/store/notification-store";
import { cn } from "@/lib/utils/helpers";

const typeConfig = {
  info:    { icon: Info,           color: "#3b82f6" },
  success: { icon: CheckCircle2,   color: "#22c55e" },
  warning: { icon: AlertTriangle,  color: "#f59e0b" },
  error:   { icon: XCircle,        color: "#ef4444" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { markRead, remove } = useNotificationStore();
  const { icon: Icon, color } = typeConfig[notification.type];

  const handleClick = () => { markRead(notification.id); onClose(); };

  const inner = (
    <div className={cn("notif-item", !notification.read && "notif-item--unread")} role="listitem">
      <div className="notif-item__icon" style={{ background: `${color}18`, color }}>
        <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div className="notif-item__body">
        <span className="notif-item__title">{notification.title}</span>
        {notification.message && <p className="notif-item__msg">{notification.message}</p>}
        <span className="notif-item__time">{timeAgo(notification.createdAt)}</span>
      </div>
      <button
        className="notif-item__remove"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(notification.id); }}
        aria-label="Remove notification"
      >
        <X size={12} />
      </button>

      <style jsx>{`
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          cursor: pointer;
          transition: background 0.14s;
          position: relative;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: var(--color-surface-hover); }
        .notif-item--unread { background: var(--color-brand-green-alpha, rgba(45,106,79,0.04)); }
        .notif-item--unread::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-brand-green);
        }
        .notif-item__icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .notif-item__body { flex: 1; min-width: 0; }
        .notif-item__title {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.3;
        }
        .notif-item__msg {
          font-size: 12px;
          color: var(--color-text-muted);
          margin: 2px 0 0;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .notif-item__time {
          display: block;
          font-size: 11px;
          color: var(--color-text-muted);
          margin-top: 3px;
          opacity: 0.7;
        }
        .notif-item__remove {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.14s, background 0.14s;
        }
        .notif-item:hover .notif-item__remove { opacity: 1; }
        .notif-item__remove:hover { background: var(--color-surface-hover); color: #ef4444; }
      `}</style>
    </div>
  );

  if (notification.href) {
    return (
      <Link href={notification.href} onClick={handleClick} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </Link>
    );
  }
  return <div onClick={handleClick}>{inner}</div>;
}
