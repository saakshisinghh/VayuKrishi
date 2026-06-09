import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        { id: "n1", type: "info",    title: "Soil analysis ready",  message: "Your Field A soil report is available.",  read: false, createdAt: new Date().toISOString(),                        href: "/analytics" },
        { id: "n2", type: "warning", title: "Rain alert",           message: "Heavy rainfall expected in 48 hours.",    read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: "n3", type: "success", title: "Scheme applied",       message: "PM-KISAN application submitted.",         read: true,  createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
      addNotification: (n) =>
        set((s) => ({
          notifications: [{ ...n, id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString() }, ...s.notifications],
        })),
      markRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      remove: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      clearAll: () => set({ notifications: [] }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "vayukrishi-notifications" }
  )
);
