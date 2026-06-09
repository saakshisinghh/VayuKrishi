"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationDropdown } from "./notification-dropdown";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = useNotificationStore((s) => s.unreadCount());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="notif-bell" ref={ref}>
      <button
        className="notif-bell__btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={19} strokeWidth={2} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              className="notif-bell__badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-bell__dropdown"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <NotificationDropdown onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .notif-bell { position: relative; }
        .notif-bell__btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: none;
          background: transparent;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.14s;
          position: relative;
        }
        .notif-bell__btn:hover { background: var(--color-surface-hover); }
        .notif-bell__btn:focus-visible { outline: 2px solid var(--color-brand-green); outline-offset: 1px; border-radius: 9px; }
        .notif-bell__badge {
          position: absolute;
          top: 5px;
          right: 5px;
          min-width: 16px;
          height: 16px;
          border-radius: 99px;
          background: #ef4444;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 2px solid var(--color-bg-base);
          font-family: 'DM Sans', sans-serif;
        }
        .notif-bell__dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
