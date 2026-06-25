import { Schema, model, Document, Types } from "mongoose";

export interface PreferenceDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  marketAlerts: boolean;
  weatherAlerts: boolean;
  diseaseAlerts: boolean;
  schemeAlerts: boolean;
  farmReminders: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const preferenceSchema = new Schema<PreferenceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Category toggles — gate whether a notification type is generated
    // for this user at all.
    marketAlerts: { type: Boolean, default: true },
    weatherAlerts: { type: Boolean, default: true },
    diseaseAlerts: { type: Boolean, default: true },
    schemeAlerts: { type: Boolean, default: true },
    farmReminders: { type: Boolean, default: true },

    // Channel toggles — gate which channels a notification is allowed
    // to be dispatched on. in_app is implicitly always enabled.
    emailEnabled: { type: Boolean, default: false },
    smsEnabled: { type: Boolean, default: false },
    whatsappEnabled: { type: Boolean, default: false },
    pushEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const PreferenceModel = model<PreferenceDocument>(
  "NotificationPreference",
  preferenceSchema
);
