import mongoose, { Document, Schema } from 'mongoose';

// ── Analytics Snapshot (optional: persist daily roll-ups for trends) ──
export interface IAnalyticsSnapshot extends Document {
  snapshotDate: Date;
  snapshotType: 'daily' | 'weekly' | 'monthly';
  scope: 'platform' | 'state' | 'district';
  scopeValue?: string; // state/district name when scope != platform

  // KPIs captured at snapshot time
  metrics: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalFarms: number;
    newFarms: number;
    totalRecommendations: number;
    totalDiseaseReports: number;
    totalNotificationsSent: number;
    totalSchemeApplications: number;
  };

  // Top items for the period
  topCrops: { cropName: string; count: number }[];
  topDiseases: { diseaseName: string; count: number }[];
  topCommodities: { commodity: string; avgPrice: number }[];

  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSnapshotSchema = new Schema<IAnalyticsSnapshot>(
  {
    snapshotDate: { type: Date, required: true, index: true },
    snapshotType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    scope: { type: String, enum: ['platform', 'state', 'district'], default: 'platform' },
    scopeValue: { type: String, trim: true },

    metrics: {
      totalUsers: { type: Number, default: 0 },
      newUsers: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      totalFarms: { type: Number, default: 0 },
      newFarms: { type: Number, default: 0 },
      totalRecommendations: { type: Number, default: 0 },
      totalDiseaseReports: { type: Number, default: 0 },
      totalNotificationsSent: { type: Number, default: 0 },
      totalSchemeApplications: { type: Number, default: 0 },
    },

    topCrops: [{ cropName: String, count: Number }],
    topDiseases: [{ diseaseName: String, count: Number }],
    topCommodities: [{ commodity: String, avgPrice: Number }],
  },
  {
    timestamps: true,
    collection: 'analytics_snapshots',
  }
);

// ── Compound indexes for fast trend queries ───────────────────
AnalyticsSnapshotSchema.index({ snapshotType: 1, snapshotDate: -1 });
AnalyticsSnapshotSchema.index({ scope: 1, scopeValue: 1, snapshotDate: -1 });
// Unique: one snapshot per type+scope+date
AnalyticsSnapshotSchema.index(
  { snapshotType: 1, scope: 1, scopeValue: 1, snapshotDate: 1 },
  { unique: true }
);

export const AnalyticsSnapshot = mongoose.model<IAnalyticsSnapshot>(
  'AnalyticsSnapshot',
  AnalyticsSnapshotSchema
);
