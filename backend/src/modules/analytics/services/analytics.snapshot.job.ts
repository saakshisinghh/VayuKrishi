/**
 * analytics.snapshot.job.ts
 *
 * Scheduled job that captures a daily platform-wide analytics snapshot.
 * Wire to your Phase 9 Bull queue or a cron scheduler.
 *
 * Cron expression: 0 1 * * *  (every day at 01:00 AM)
 */

import { AnalyticsSnapshot } from '../analytics.model';
import {
  getOverview,
  getCropAnalytics,
  getDiseaseAnalytics,
  getMarketAnalytics,
  getSchemeAnalytics,
  getNotificationAnalytics,
} from '../services/analytics.service';
import { invalidateCacheByPrefix } from '../services/analytics.cache';

export async function runDailySnapshot(): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('[AnalyticsSnapshot] Starting daily snapshot for', today.toISOString());

  try {
    const [overview, crops, diseases, market, , notifications] = await Promise.all([
      getOverview({}),
      getCropAnalytics({}),
      getDiseaseAnalytics({}),
      getMarketAnalytics({}),
      getSchemeAnalytics({}),
      getNotificationAnalytics({}),
    ]);

    await AnalyticsSnapshot.findOneAndUpdate(
      { snapshotType: 'daily', scope: 'platform', snapshotDate: today },
      {
        $set: {
          metrics: {
            totalUsers: overview.totalUsers,
            newUsers: overview.newUsersLast30Days,
            activeUsers: overview.activeUsersLast30Days,
            totalFarms: overview.totalFarms,
            newFarms: 0, // derive from farm growth trend if needed
            totalRecommendations: overview.totalRecommendations,
            totalDiseaseReports: overview.totalDiseaseReports,
            totalNotificationsSent: notifications.totalSent,
            totalSchemeApplications: 0,
          },
          topCrops: crops.mostRecommendedCrops.slice(0, 5).map((c) => ({
            cropName: c.cropName,
            count: c.count,
          })),
          topDiseases: diseases.mostCommonDiseases.slice(0, 5).map((d) => ({
            diseaseName: d.diseaseName,
            count: d.count,
          })),
          topCommodities: market.topCommodities.slice(0, 5).map((c) => ({
            commodity: c.commodity,
            avgPrice: c.avgPrice,
          })),
        },
      },
      { upsert: true, new: true }
    );

    // Purge all analytics caches after snapshot so next request is fresh
    await invalidateCacheByPrefix('');

    console.log('[AnalyticsSnapshot] Daily snapshot completed successfully');
  } catch (err) {
    console.error('[AnalyticsSnapshot] Failed to create snapshot:', err);
    throw err;
  }
}
