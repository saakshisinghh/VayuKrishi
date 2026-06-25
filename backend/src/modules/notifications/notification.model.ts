import { Schema, model, Document, Types } from "mongoose";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
  NotificationStatus,
  NotificationMetadata,
} from "./types/notification.types";

export interface NotificationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  channel: NotificationChannel;
  status: NotificationStatus;
  metadata: NotificationMetadata;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.MEDIUM,
    },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      default: NotificationChannel.IN_APP,
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for the access patterns the API actually uses:
// "give me this user's notifications, newest first, optionally filtered"
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

// Fast unread-count lookups
notificationSchema.index({ userId: 1, readAt: 1 });

export const NotificationModel = model<NotificationDocument>(
  "Notification",
  notificationSchema
);
