import {
  OverviewRepository,
  FarmRepository,
  CropRepository,
  DiseaseRepository,
  MarketRepository,
  SchemeRepository,
  NotificationRepository,
  UserDashboardRepository,
} from '../repositories/analytics.repository';
import { withCache, buildCacheKey, CACHE_TTL } from './analytics.cache';
import {
  AnalyticsFilters,
  OverviewMetrics,
  FarmAnalytics,
  CropAnalytics,
  DiseaseAnalytics,
  MarketAnalytics,
  SchemeAnalytics,
  NotificationAnalytics,
  DashboardAnalytics,
  FarmerDashboard,
  AdminDashboard,
} from '../types/analytics.types';

// ── Overview ──────────────────────────────────────────────────
export async function getOverview(filters: AnalyticsFilters): Promise<OverviewMetrics> {
  const key = buildCacheKey('overview', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.OVERVIEW, () => OverviewRepository.getKPIs(filters));
}

// ── Farm Analytics ────────────────────────────────────────────
export async function getFarmAnalytics(filters: AnalyticsFilters): Promise<FarmAnalytics> {
  const key = buildCacheKey('farms', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.FARMS, async () => {
    const [farmsByState, farmsByDistrict, soilTypeDistribution, waterSourceDistribution, sizeData, farmGrowthTrend] =
      await Promise.all([
        FarmRepository.getFarmsByState(filters),
        FarmRepository.getFarmsByDistrict(filters),
        FarmRepository.getSoilTypeDistribution(filters),
        FarmRepository.getWaterSourceDistribution(filters),
        FarmRepository.getAverageFarmSize(filters),
        FarmRepository.getFarmGrowthTrend(filters),
      ]);

    return {
      totalFarms: sizeData.totalFarms ?? 0,
      averageFarmSizeAcres: parseFloat((sizeData.avgSize ?? 0).toFixed(2)),
      farmsByState,
      farmsByDistrict,
      soilTypeDistribution,
      waterSourceDistribution,
      farmGrowthTrend,
    };
  });
}

// ── Crop Analytics ────────────────────────────────────────────
// NOTE: the real registered model name is "Recommendation", not
// "CropRecommendation" — see repositories/analytics.repository.ts.
export async function getCropAnalytics(filters: AnalyticsFilters): Promise<CropAnalytics> {
  const key = buildCacheKey('crops', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.CROPS, async () => {
    const [mostRecommendedCrops, recommendationTrends, seasonDistribution, avgConfidenceScore, totalRecs] =
      await Promise.all([
        CropRepository.getMostRecommendedCrops(filters),
        CropRepository.getRecommendationTrends(filters),
        CropRepository.getSeasonDistribution(filters),
        CropRepository.getAvgConfidenceScore(filters),
        import('mongoose').then(({ default: mongoose }) =>
          mongoose.model('Recommendation').countDocuments()
        ),
      ]);

    return {
      totalRecommendations: totalRecs,
      mostRecommendedCrops,
      recommendationTrends,
      seasonDistribution,
      avgConfidenceScore: parseFloat((avgConfidenceScore as number).toFixed(2)),
    };
  });
}

// ── Disease Analytics ─────────────────────────────────────────
export async function getDiseaseAnalytics(filters: AnalyticsFilters): Promise<DiseaseAnalytics> {
  const key = buildCacheKey('diseases', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.DISEASES, async () => {
    const mongoose = (await import('mongoose')).default;

    const [
      mostCommonDiseases,
      severityBreakdown,
      diseaseTrends,
      diseaseByState,
      verifiedReports,
      totalReports,
    ] = await Promise.all([
      DiseaseRepository.getMostCommonDiseases(filters),
      DiseaseRepository.getSeverityBreakdown(filters),
      DiseaseRepository.getDiseaseTrends(filters),
      DiseaseRepository.getDiseaseByState(filters),
      DiseaseRepository.getVerifiedCount(filters),
      mongoose.model('DiseaseReport').countDocuments(),
    ]);

    return {
      totalReports,
      verifiedReports,
      mostCommonDiseases,
      severityBreakdown,
      diseaseTrends,
      diseaseByState,
    };
  });
}

// ── Market Analytics ──────────────────────────────────────────
export async function getMarketAnalytics(filters: AnalyticsFilters): Promise<MarketAnalytics> {
  const key = buildCacheKey('market', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.MARKET, async () => {
    const mongoose = (await import('mongoose')).default;

    const [topCommodities, marketActivityByState, priceTrends, totalDataPoints] = await Promise.all([
      MarketRepository.getTopCommodities(filters),
      MarketRepository.getMarketActivityByState(filters),
      MarketRepository.getPriceTrends(filters),
      mongoose.model('MarketPrice').countDocuments(),
    ]);

    return {
      totalDataPoints,
      trackedCommodities: topCommodities.length,
      topCommodities,
      priceVolatility: (topCommodities as { commodity: string; maxPrice: number; minPrice: number }[]).map((c) => ({
        commodity: c.commodity,
        volatilityScore: parseFloat(((c.maxPrice - c.minPrice) / Math.max(c.minPrice, 1)).toFixed(4)),
      })),
      marketActivityByState,
      priceTrends,
    };
  });
}

// ── Scheme Analytics ──────────────────────────────────────────
// NOTE: the real registered model name is "Application", not
// "SchemeApplication" — see repositories/analytics.repository.ts.
export async function getSchemeAnalytics(filters: AnalyticsFilters): Promise<SchemeAnalytics> {
  const key = buildCacheKey('schemes', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.SCHEMES, async () => {
    const mongoose = (await import('mongoose')).default;

    const [
      mostViewedSchemes,
      mostAppliedSchemes,
      stateWiseAdoption,
      applicationTrends,
      approvalData,
      totalSchemes,
      totalApplications,
    ] = await Promise.all([
      SchemeRepository.getMostViewedSchemes(filters),
      SchemeRepository.getMostAppliedSchemes(filters),
      SchemeRepository.getStateWiseAdoption(filters),
      SchemeRepository.getApplicationTrends(filters),
      SchemeRepository.getOverallApprovalRate(),
      mongoose.model('Scheme').countDocuments({ isActive: true }),
      mongoose.model('Application').countDocuments(),
    ]);

    return {
      totalSchemes,
      totalApplications,
      overallApprovalRate: parseFloat((approvalData.approvalRate ?? 0).toFixed(2)),
      mostViewedSchemes,
      mostAppliedSchemes,
      stateWiseAdoption,
      applicationTrends,
    };
  });
}

// ── Notification Analytics ────────────────────────────────────
export async function getNotificationAnalytics(filters: AnalyticsFilters): Promise<NotificationAnalytics> {
  const key = buildCacheKey('notifications', filters as Record<string, unknown>);
  return withCache(key, CACHE_TTL.NOTIFICATIONS, async () => {
    const [summary, typeBreakdown, engagementTrends] = await Promise.all([
      NotificationRepository.getSummary(filters),
      NotificationRepository.getTypeBreakdown(filters),
      NotificationRepository.getEngagementTrends(filters),
    ]);

    return {
      totalSent: summary.totalSent,
      totalDelivered: summary.totalDelivered,
      totalRead: summary.totalRead,
      unreadCount: summary.unreadCount,
      deliveryRate: parseFloat((summary.deliveryRate ?? 0).toFixed(2)),
      readRate: parseFloat((summary.readRate ?? 0).toFixed(2)),
      typeBreakdown,
      engagementTrends,
    };
  });
}

// ── Farmer Dashboard ──────────────────────────────────────────
async function buildFarmerDashboard(userId: string): Promise<FarmerDashboard> {
  const [farmsResult, recsResult, diseaseResult, notifResult] = await Promise.all([
    UserDashboardRepository.getFarmerFarms(userId),
    UserDashboardRepository.getFarmerRecommendations(userId),
    UserDashboardRepository.getFarmerDiseaseReports(userId),
    UserDashboardRepository.getFarmerNotifications(userId),
  ]);

  const farms = farmsResult[0] ?? { summary: [], farms: [] };
  const recs = recsResult[0] ?? { total: [], recent: [] };
  const disease = diseaseResult[0] ?? { summary: [], recent: [] };
  const notif = notifResult[0] ?? { summary: [], recent: [] };

  return {
    myFarms: {
      total: farms.summary[0]?.total ?? 0,
      totalAreaAcres: farms.summary[0]?.totalAreaAcres ?? 0,
      farms: farms.farms ?? [],
    },
    myRecommendations: {
      total: recs.total[0]?.count ?? 0,
      recent: recs.recent ?? [],
    },
    myDiseaseReports: {
      total: disease.summary[0]?.total ?? 0,
      pending: disease.summary[0]?.pending ?? 0,
      verified: disease.summary[0]?.verified ?? 0,
      recent: disease.recent ?? [],
    },
    myNotifications: {
      total: notif.summary[0]?.total ?? 0,
      unread: notif.summary[0]?.unread ?? 0,
      recent: notif.recent ?? [],
    },
  };
}

// ── Admin Dashboard ───────────────────────────────────────────
async function buildAdminDashboard(filters: AnalyticsFilters): Promise<AdminDashboard> {
  const [overview, farmData, cropData, diseaseData, marketData, schemeData, notifData] =
    await Promise.all([
      getOverview(filters),
      getFarmAnalytics(filters),
      getCropAnalytics(filters),
      getDiseaseAnalytics(filters),
      getMarketAnalytics(filters),
      getSchemeAnalytics(filters),
      getNotificationAnalytics(filters),
    ]);

  return {
    overview,
    farmAnalytics: {
      totalFarms: farmData.totalFarms,
      farmsByState: farmData.farmsByState,
      soilTypeDistribution: farmData.soilTypeDistribution,
    },
    cropAnalytics: {
      totalRecommendations: cropData.totalRecommendations,
      mostRecommendedCrops: cropData.mostRecommendedCrops,
    },
    diseaseAnalytics: {
      totalReports: diseaseData.totalReports,
      mostCommonDiseases: diseaseData.mostCommonDiseases,
      severityBreakdown: diseaseData.severityBreakdown,
    },
    marketAnalytics: {
      trackedCommodities: marketData.trackedCommodities,
      topCommodities: marketData.topCommodities,
    },
    schemeAnalytics: {
      totalApplications: schemeData.totalApplications,
      overallApprovalRate: schemeData.overallApprovalRate,
    },
    notificationAnalytics: {
      totalSent: notifData.totalSent,
      readRate: notifData.readRate,
      deliveryRate: notifData.deliveryRate,
    },
  };
}

// ── Combined Dashboard ────────────────────────────────────────
export async function getDashboardAnalytics(
  role: 'farmer' | 'consultant' | 'fpo_manager' | 'admin',
  userId: string,
  filters: AnalyticsFilters
): Promise<DashboardAnalytics> {
  if (role === 'farmer') {
    const key = buildCacheKey(`dashboard:farmer:${userId}`, {});
    const farmer = await withCache(key, CACHE_TTL.DASHBOARD, () => buildFarmerDashboard(userId));
    return { role, farmer };
  }

  // consultant / fpo_manager get scoped admin view + their own farmer view
  if (role === 'consultant' || role === 'fpo_manager') {
    const [farmer, admin] = await Promise.all([
      buildFarmerDashboard(userId),
      buildAdminDashboard(filters),
    ]);
    return { role, farmer, admin };
  }

  // admin gets full dashboard
  const key = buildCacheKey('dashboard:admin', filters as Record<string, unknown>);
  const admin = await withCache(key, CACHE_TTL.DASHBOARD, () => buildAdminDashboard(filters));
  return { role, admin };
}
