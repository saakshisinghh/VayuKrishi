"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationItem } from "./notification-item";

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAllRead, clearAll } = useNotificationStore();

  return (
    <div className="notif-dropdown" role="dialog" aria-label="Notifications">
      <div className="notif-dropdown__header">
        <span className="notif-dropdown__title">
          <Bell size={15} aria-hidden="true" /> Notifications
        </span>
        <div className="notif-dropdown__actions">
          <button className="notif-dropdown__btn" onClick={markAllRead} aria-label="Mark all read" title="Mark all read">
            <CheckCheck size={14} />
          </button>
          <button className="notif-dropdown__btn" onClick={clearAll} aria-label="Clear all" title="Clear all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="notif-dropdown__list" role="list">
        {notifications.length === 0 ? (
          <div className="notif-dropdown__empty">
            <Bell size={28} strokeWidth={1.5} aria-hidden="true" />
            <span>You&apos;re all caught up</span>
          </div>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} notification={n} onClose={onClose} />)
        )}
      </div>

      <style jsx>{`
        .notif-dropdown {
          width: 340px;
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
          overflow: hidden;
        }
        .notif-dropdown__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 12px;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .notif-dropdown__title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: 'DM Sans', sans-serif;
        }
        .notif-dropdown__actions { display: flex; gap: 4px; }
        .notif-dropdown__btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
        }
        .notif-dropdown__btn:hover { background: var(--color-surface-hover); color: var(--color-text-primary); }
        .notif-dropdown__list { max-height: 360px; overflow-y: auto; }
        .notif-dropdown__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 36px 16px;
          color: var(--color-text-muted);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
