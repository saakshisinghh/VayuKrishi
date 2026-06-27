import mongoose, { PipelineStage } from 'mongoose';
import { AnalyticsFilters } from '../types/analytics.types';

/**
 * ── Model name corrections ─────────────────────────────────────
 * The original Phase 10 draft assumed model names that don't match
 * what's actually registered in this project. Corrected mapping:
 *   "CropRecommendation" -> "Recommendation"   (modules/crop-recommendation/recommendation.model.ts)
 *   "SchemeApplication"  -> "Application"      (modules/schemes/application.model.ts)
 * Farm, DiseaseReport, MarketPrice, Scheme, Notification, User are
 * registered under those same names, but several FIELD names below
 * also needed correcting — see inline notes on each repository.
 */
const User = () => mongoose.model('User');
const Farm = () => mongoose.model('Farm');
const Recommendation = () => mongoose.model('Recommendation');
const DiseaseReport = () => mongoose.model('DiseaseReport');
const MarketPrice = () => mongoose.model('MarketPrice');
const Scheme = () => mongoose.model('Scheme');
const Application = () => mongoose.model('Application');
const Notification = () => mongoose.model('Notification');

// ── Helpers ───────────────────────────────────────────────────
function dateMatchStage(
  field: string,
  startDate?: Date,
  endDate?: Date
): PipelineStage.Match | null {
  if (!startDate && !endDate) return null;
  const cond: Record<string, Date> = {};
  if (startDate) cond.$gte = startDate;
  if (endDate) cond.$lte = endDate;
  return { $match: { [field]: cond } };
}

function monthGroupId(dateField: string) {
  return {
    year: { $year: `$${dateField}` },
    month: { $month: `$${dateField}` },
  };
}

const monthLabelStage = {
  $concat: [
    { $toString: '$_id.year' },
    '-',
    {
      $cond: [
        { $lt: ['$_id.month', 10] },
        { $concat: ['0', { $toString: '$_id.month' }] },
        { $toString: '$_id.month' },
      ],
    },
  ],
};

// Severity on DiseaseReport.analysis.severity is an enum string
// ('mild' | 'moderate' | 'severe'), not a number — map to a numeric
// score so "avgSeverity" is meaningful to average/sort by.
const SEVERITY_SCORE_EXPR = {
  $switch: {
    branches: [
      { case: { $eq: ['$analysis.severity', 'mild'] }, then: 1 },
      { case: { $eq: ['$analysis.severity', 'moderate'] }, then: 2 },
      { case: { $eq: ['$analysis.severity', 'severe'] }, then: 3 },
    ],
    default: 0,
  },
};

// ── Overview Repository ───────────────────────────────────────
export const OverviewRepository = {
  async getKPIs(filters: AnalyticsFilters) {
    const dateFilter = filters.startDate
      ? { createdAt: { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) } }
      : {};

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // NOTE: User has no isDeleted or lastActiveAt field in this project,
    // so "active users" can't be measured yet — returned as 0 rather
    // than silently filtering on a field that doesn't exist.
    const [
      totalUsers,
      totalFarms,
      totalRecommendations,
      totalDiseaseReports,
      totalSchemes,
      totalNotifications,
      newUsersLast30Days,
    ] = await Promise.all([
      User().countDocuments(dateFilter),
      Farm().countDocuments(dateFilter),
      Recommendation().countDocuments(dateFilter),
      DiseaseReport().countDocuments(dateFilter),
      Scheme().countDocuments({ isActive: true }),
      Notification().countDocuments(dateFilter),
      User().countDocuments({ createdAt: { $gte: last30Days } }),
    ]);

    return {
      totalUsers,
      totalFarms,
      totalRecommendations,
      totalDiseaseReports,
      totalSchemes,
      totalNotifications,
      newUsersLast30Days,
      activeUsersLast30Days: 0, // see note above
    };
  },
};

// ── Farm Repository ───────────────────────────────────────────
// Farm has no top-level "isDeleted" or "areaAcres" field — it uses
// `totalArea` + `areaUnit` ('acre' | 'hectare'). Sizes are normalized
// to acres below since the API contract reports "averageFarmSizeAcres".
const ACRES_PER_HECTARE = 2.47105;
const AREA_IN_ACRES_EXPR = {
  $cond: [
    { $eq: ['$areaUnit', 'hectare'] },
    { $multiply: ['$totalArea', ACRES_PER_HECTARE] },
    '$totalArea',
  ],
};

export const FarmRepository = {
  async getFarmsByState(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['location.state'] = filters.state;
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Farm().aggregate([
      { $match: match },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $project: { _id: 0, state: '$_id', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
  },

  async getFarmsByDistrict(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['location.state'] = filters.state;
    if (filters.district) match['location.district'] = filters.district;

    return Farm().aggregate([
      { $match: match },
      { $group: { _id: '$location.district', count: { $sum: 1 } } },
      { $project: { _id: 0, district: '$_id', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
  },

  async getSoilTypeDistribution(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['location.state'] = filters.state;

    const results = await Farm().aggregate([
      { $match: match },
      { $group: { _id: '$soilType', count: { $sum: 1 } } },
      { $project: { _id: 0, soilType: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    const total = results.reduce((sum: number, r: { count: number }) => sum + r.count, 0);
    return results.map((r: { soilType: string; count: number }) => ({
      ...r,
      percentage: total > 0 ? parseFloat(((r.count / total) * 100).toFixed(2)) : 0,
    }));
  },

  async getWaterSourceDistribution(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['location.state'] = filters.state;

    const results = await Farm().aggregate([
      { $match: match },
      { $group: { _id: '$waterSource', count: { $sum: 1 } } },
      { $project: { _id: 0, waterSource: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    const total = results.reduce((sum: number, r: { count: number }) => sum + r.count, 0);
    return results.map((r: { waterSource: string; count: number }) => ({
      ...r,
      percentage: total > 0 ? parseFloat(((r.count / total) * 100).toFixed(2)) : 0,
    }));
  },

  async getAverageFarmSize(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['location.state'] = filters.state;

    const result = await Farm().aggregate([
      { $match: match },
      {
        $project: { areaAcres: AREA_IN_ACRES_EXPR },
      },
      {
        $group: {
          _id: null,
          avgSize: { $avg: '$areaAcres' },
          totalFarms: { $sum: 1 },
          totalArea: { $sum: '$areaAcres' },
        },
      },
    ]);

    return result[0] ?? { avgSize: 0, totalFarms: 0, totalArea: 0 };
  },

  async getFarmGrowthTrend(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    const dateStage = dateMatchStage('createdAt', filters.startDate, filters.endDate);
    if (dateStage) Object.assign(match, dateStage.$match);

    return Farm().aggregate([
      { $match: match },
      { $group: { _id: monthGroupId('createdAt'), count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, month: monthLabelStage, count: 1 } },
    ]);
  },
};

// ── Crop Repository ───────────────────────────────────────────
// Recommendation stores location at inputData.location.state, not a
// top-level farmLocation.state.
export const CropRepository = {
  async getMostRecommendedCrops(filters: AnalyticsFilters, limit = 10) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['inputData.location.state'] = filters.state;
    if (filters.season) match['season'] = filters.season;
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Recommendation().aggregate([
      { $match: match },
      { $unwind: '$recommendations' },
      {
        $group: {
          _id: '$recommendations.cropName',
          count: { $sum: 1 },
          avgConfidenceScore: { $avg: '$recommendations.confidenceScore' },
        },
      },
      { $project: { _id: 0, cropName: '$_id', count: 1, avgConfidenceScore: { $round: ['$avgConfidenceScore', 2] } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  },

  async getRecommendationTrends(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Recommendation().aggregate([
      { $match: match },
      { $group: { _id: monthGroupId('createdAt'), count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, month: monthLabelStage, count: 1 } },
    ]);
  },

  async getSeasonDistribution(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.state) match['inputData.location.state'] = filters.state;

    return Recommendation().aggregate([
      { $match: match },
      { $group: { _id: '$season', count: { $sum: 1 } } },
      { $project: { _id: 0, season: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  },

  async getAvgConfidenceScore(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    const result = await Recommendation().aggregate([
      { $match: match },
      { $unwind: '$recommendations' },
      { $group: { _id: null, avgScore: { $avg: '$recommendations.confidenceScore' } } },
    ]);

    return result[0]?.avgScore ?? 0;
  },
};

// ── Disease Repository ────────────────────────────────────────
// DiseaseReport has no top-level diseaseName/severity/location — those
// live nested under `analysis` (null until status:"completed"), and
// district/state live on the related Farm via `farmId`. State-based
// queries below join through farmId -> Farm.location.state.
export const DiseaseRepository = {
  async getMostCommonDiseases(filters: AnalyticsFilters, limit = 10) {
    const match: Record<string, unknown> = {
      status: 'completed',
      analysis: { $ne: null },
    };
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (filters.state) {
      pipeline.push(
        { $lookup: { from: 'farms', localField: 'farmId', foreignField: '_id', as: 'farm' } },
        { $unwind: '$farm' },
        { $match: { 'farm.location.state': filters.state } }
      );
    }

    pipeline.push(
      {
        $group: {
          _id: '$analysis.diseaseName',
          count: { $sum: 1 },
          avgSeverity: { $avg: SEVERITY_SCORE_EXPR },
        },
      },
      { $project: { _id: 0, diseaseName: '$_id', count: 1, avgSeverity: { $round: ['$avgSeverity', 2] } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    );

    return DiseaseReport().aggregate(pipeline);
  },

  async getSeverityBreakdown(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = { status: 'completed', analysis: { $ne: null } };
    const pipeline: PipelineStage[] = [{ $match: match }];

    if (filters.state) {
      pipeline.push(
        { $lookup: { from: 'farms', localField: 'farmId', foreignField: '_id', as: 'farm' } },
        { $unwind: '$farm' },
        { $match: { 'farm.location.state': filters.state } }
      );
    }

    pipeline.push(
      { $group: { _id: '$analysis.severity', count: { $sum: 1 } } },
      { $project: { _id: 0, severity: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    );

    return DiseaseReport().aggregate(pipeline);
  },

  async getDiseaseTrends(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return DiseaseReport().aggregate([
      { $match: match },
      { $group: { _id: monthGroupId('createdAt'), count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, month: monthLabelStage, count: 1 } },
    ]);
  },

  async getDiseaseByState(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return DiseaseReport().aggregate([
      { $match: match },
      { $lookup: { from: 'farms', localField: 'farmId', foreignField: '_id', as: 'farm' } },
      { $unwind: '$farm' },
      { $group: { _id: '$farm.location.state', count: { $sum: 1 } } },
      { $project: { _id: 0, state: '$_id', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
  },

  async getVerifiedCount(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = { verifiedByExpert: true };
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };
    return DiseaseReport().countDocuments(match);
  },
};

// ── Market Repository ─────────────────────────────────────────
// MarketPrice uses `modalPrice` (not pricePerQuintal) and `arrivalDate`
// (not date). `state` matches as-is.
export const MarketRepository = {
  async getTopCommodities(filters: AnalyticsFilters, limit = 10) {
    const match: Record<string, unknown> = {};
    if (filters.state) match.state = filters.state;
    if (filters.commodity) match.commodity = filters.commodity;
    if (filters.startDate) match.arrivalDate = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return MarketPrice().aggregate([
      { $match: match },
      {
        $group: {
          _id: '$commodity',
          avgPrice: { $avg: '$modalPrice' },
          minPrice: { $min: '$modalPrice' },
          maxPrice: { $max: '$modalPrice' },
          dataPoints: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          commodity: '$_id',
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          dataPoints: 1,
          priceChangePercent: {
            $multiply: [
              { $divide: [{ $subtract: ['$maxPrice', '$minPrice'] }, { $ifNull: ['$minPrice', 1] }] },
              100,
            ],
          },
        },
      },
      { $sort: { dataPoints: -1 } },
      { $limit: limit },
    ]);
  },

  async getMarketActivityByState(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.arrivalDate = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return MarketPrice().aggregate([
      { $match: match },
      { $group: { _id: '$state', dataPoints: { $sum: 1 } } },
      { $project: { _id: 0, state: '$_id', dataPoints: 1 } },
      { $sort: { dataPoints: -1 } },
      { $limit: 20 },
    ]);
  },

  async getPriceTrends(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.commodity) match.commodity = filters.commodity;
    if (filters.startDate) match.arrivalDate = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return MarketPrice().aggregate([
      { $match: match },
      {
        $group: {
          _id: { ...monthGroupId('arrivalDate'), commodity: '$commodity' },
          avgPrice: { $avg: '$modalPrice' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: monthLabelStage,
          commodity: '$_id.commodity',
          avgPrice: { $round: ['$avgPrice', 2] },
        },
      },
      { $limit: 200 },
    ]);
  },
};

// ── Scheme Repository ─────────────────────────────────────────
// Scheme uses schemeName (not title), eligibilityCriteria.states (not
// eligibility.states), and viewCount (not views). Application has no
// applicantState field — state-based queries join through farmId ->
// Farm.location.state (falling back to userId if a given application
// has no farmId, in which case it's excluded from state breakdowns).
export const SchemeRepository = {
  async getMostViewedSchemes(filters: AnalyticsFilters, limit = 10) {
    const match: Record<string, unknown> = { isActive: true };
    if (filters.state) match['eligibilityCriteria.states'] = filters.state;

    return Scheme().aggregate([
      { $match: match },
      { $project: { _id: 0, schemeId: '$_id', title: '$schemeName', views: '$viewCount' } },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]);
  },

  async getMostAppliedSchemes(filters: AnalyticsFilters, limit = 10) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (filters.state) {
      pipeline.push(
        { $lookup: { from: 'farms', localField: 'farmId', foreignField: '_id', as: 'farm' } },
        { $unwind: { path: '$farm', preserveNullAndEmptyArrays: false } },
        { $match: { 'farm.location.state': filters.state } }
      );
    }

    pipeline.push(
      {
        $group: {
          _id: '$schemeId',
          applications: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'schemes',
          localField: '_id',
          foreignField: '_id',
          as: 'scheme',
        },
      },
      { $unwind: { path: '$scheme', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          schemeId: '$_id',
          title: '$scheme.schemeName',
          applications: 1,
          approvalRate: {
            $multiply: [
              { $divide: ['$approved', { $ifNull: ['$applications', 1] }] },
              100,
            ],
          },
        },
      },
      { $sort: { applications: -1 } },
      { $limit: limit }
    );

    return Application().aggregate(pipeline);
  },

  async getStateWiseAdoption(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    // Prefer the farm's state when farmId is set; many applications have
    // no linked farm (farmId is optional), so fall back to the
    // applicant's own User.profile.state rather than silently dropping
    // those applications from the breakdown. Farm.location.state and
    // User.profile.state aren't guaranteed to share the same casing
    // (e.g. "Maharashtra" vs "maharashtra"), so group on a lowercased
    // key and display the first-seen original casing per group.
    return Application().aggregate([
      { $match: match },
      { $lookup: { from: 'farms', localField: 'farmId', foreignField: '_id', as: 'farm' } },
      { $unwind: { path: '$farm', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          resolvedState: {
            $ifNull: ['$farm.location.state', '$user.profile.state'],
          },
        },
      },
      { $match: { resolvedState: { $ne: null } } },
      {
        $group: {
          _id: { $toLower: '$resolvedState' },
          state: { $first: '$resolvedState' },
          applications: { $sum: 1 },
        },
      },
      { $project: { _id: 0, state: 1, applications: 1 } },
      { $sort: { applications: -1 } },
      { $limit: 30 },
    ]);
  },
  async getApplicationTrends(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Application().aggregate([
      { $match: match },
      { $group: { _id: monthGroupId('createdAt'), count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, month: monthLabelStage, count: 1 } },
    ]);
  },

  async getOverallApprovalRate() {
    const result = await Application().aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          approvalRate: { $multiply: [{ $divide: ['$approved', { $ifNull: ['$total', 1] }] }, 100] },
          total: 1,
        },
      },
    ]);

    return result[0] ?? { approvalRate: 0, total: 0 };
  },
};

// ── Notification Repository ───────────────────────────────────
// Notification uses `status` ('pending'|'delivered'|'read'|'failed')
// and `readAt`, not isRead/isDelivered booleans.
export const NotificationRepository = {
  async getTypeBreakdown(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Notification().aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          readCount: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          readRate: {
            $multiply: [{ $divide: ['$readCount', { $ifNull: ['$count', 1] }] }, 100],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);
  },

  async getEngagementTrends(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    return Notification().aggregate([
      { $match: match },
      {
        $group: {
          _id: monthGroupId('createdAt'),
          sent: { $sum: 1 },
          read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, month: monthLabelStage, sent: 1, read: 1 } },
    ]);
  },

  async getSummary(filters: AnalyticsFilters) {
    const match: Record<string, unknown> = {};
    if (filters.startDate) match.createdAt = { $gte: filters.startDate, ...(filters.endDate && { $lte: filters.endDate }) };

    const result = await Notification().aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSent: { $sum: 1 },
          totalDelivered: {
            $sum: { $cond: [{ $in: ['$status', ['delivered', 'read']] }, 1, 0] },
          },
          totalRead: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
          unreadCount: { $sum: { $cond: [{ $ne: ['$status', 'read'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalSent: 1,
          totalDelivered: 1,
          totalRead: 1,
          unreadCount: 1,
          deliveryRate: {
            $multiply: [{ $divide: ['$totalDelivered', { $ifNull: ['$totalSent', 1] }] }, 100],
          },
          readRate: {
            $multiply: [{ $divide: ['$totalRead', { $ifNull: ['$totalSent', 1] }] }, 100],
          },
        },
      },
    ]);

    return result[0] ?? { totalSent: 0, totalDelivered: 0, totalRead: 0, unreadCount: 0, deliveryRate: 0, readRate: 0 };
  },
};

// ── User Dashboard Repository ─────────────────────────────────
// Farm uses `userId` (not owner) and `totalArea`+`areaUnit` (not
// areaAcres). DiseaseReport uses `userId` (not reportedBy) and nested
// `analysis.diseaseName`/`analysis.severity`. Notification uses
// `status`/`readAt` (not isRead). Recommendation's per-item crop name
// lives in the `recommendations` array, same as before.
export const UserDashboardRepository = {
  async getFarmerFarms(userId: string) {
    return Farm().aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                totalAreaAcres: { $sum: AREA_IN_ACRES_EXPR },
              },
            },
          ],
          farms: [
            {
              $project: {
                _id: 0,
                farmId: '$_id',
                name: 1,
                location: { $concat: ['$location.district', ', ', '$location.state'] },
                areaAcres: AREA_IN_ACRES_EXPR,
              },
            },
            { $limit: 5 },
          ],
        },
      },
    ]);
  },

  async getFarmerRecommendations(userId: string) {
    return Recommendation().aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 0,
                recommendationId: '$_id',
                cropName: { $arrayElemAt: ['$recommendations.cropName', 0] },
                confidenceScore: { $arrayElemAt: ['$recommendations.confidenceScore', 0] },
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
  },

  async getFarmerDiseaseReports(userId: string) {
    return DiseaseReport().aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                verified: { $sum: { $cond: [{ $eq: ['$verifiedByExpert', true] }, 1, 0] } },
              },
            },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 0,
                reportId: '$_id',
                diseaseName: '$analysis.diseaseName',
                severity: '$analysis.severity',
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
  },

  async getFarmerNotifications(userId: string) {
    return Notification().aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                unread: { $sum: { $cond: [{ $ne: ['$status', 'read'] }, 1, 0] } },
              },
            },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                notificationId: '$_id',
                title: 1,
                type: 1,
                isRead: { $eq: ['$status', 'read'] },
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
  },
};
