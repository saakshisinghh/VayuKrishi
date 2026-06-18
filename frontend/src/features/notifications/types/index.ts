export type NotificationType = "info" | "success" | "warning" | "critical";

export type NotificationCategory =
  | "weather"
  | "disease"
  | "market"
  | "scheme"
  | "task"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationSettings {
  weather: boolean;
  disease: boolean;
  market: boolean;
  scheme: boolean;
  task: boolean;
  system: boolean;
  emailDigest: boolean;
  smsAlerts: boolean;
  pushEnabled: boolean;
}
