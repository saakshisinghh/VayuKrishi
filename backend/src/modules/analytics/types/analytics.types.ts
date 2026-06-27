export interface AnalyticsFilters {
  state?: string;
  district?: string;
  startDate?: Date;
  endDate?: Date;
  season?: string;
  commodity?: string;
  crop?: string;
  userId?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// ── Overview ──────────────────────────────────────────────────
export interface OverviewMetrics {
  totalUsers: number;
  totalFarms: number;
  totalRecommendations: number;
  totalDiseaseReports: number;
  totalSchemes: number;
  totalNotifications: number;
  newUsersLast30Days: number;
  activeUsersLast30Days: number;
}

// ── Farms ─────────────────────────────────────────────────────
export interface FarmsByState {
  state: string;
  count: number;
}

export interface SoilTypeDistribution {
  soilType: string;
  count: number;
  percentage: number;
}

export interface WaterSourceDistribution {
  waterSource: string;
  count: number;
  percentage: number;
}

export interface FarmAnalytics {
  totalFarms: number;
  averageFarmSizeAcres: number;
  farmsByState: FarmsByState[];
  farmsByDistrict: { district: string; count: number }[];
  soilTypeDistribution: SoilTypeDistribution[];
  waterSourceDistribution: WaterSourceDistribution[];
  farmGrowthTrend: { month: string; count: number }[];
}

// ── Crops ─────────────────────────────────────────────────────
export interface CropRecommendationTrend {
  month: string;
  count: number;
}

export interface MostRecommendedCrop {
  cropName: string;
  count: number;
  avgConfidenceScore: number;
}

export interface CropAnalytics {
  totalRecommendations: number;
  mostRecommendedCrops: MostRecommendedCrop[];
  recommendationTrends: CropRecommendationTrend[];
  seasonDistribution: { season: string; count: number }[];
  avgConfidenceScore: number;
}

// ── Diseases ──────────────────────────────────────────────────
export interface DiseaseReport {
  diseaseName: string;
  count: number;
  avgSeverity: number;
}

export interface DiseaseAnalytics {
  totalReports: number;
  verifiedReports: number;
  mostCommonDiseases: DiseaseReport[];
  severityBreakdown: { severity: string; count: number }[];
  diseaseTrends: { month: string; count: number }[];
  diseaseByState: { state: string; count: number }[];
}

// ── Market ────────────────────────────────────────────────────
export interface CommodityAnalytics {
  commodity: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChangePercent: number;
  dataPoints: number;
}

export interface MarketAnalytics {
  totalDataPoints: number;
  trackedCommodities: number;
  topCommodities: CommodityAnalytics[];
  priceVolatility: { commodity: string; volatilityScore: number }[];
  marketActivityByState: { state: string; dataPoints: number }[];
  priceTrends: { month: string; avgPrice: number; commodity: string }[];
}

// ── Schemes ───────────────────────────────────────────────────
export interface SchemeAnalytics {
  totalSchemes: number;
  totalApplications: number;
  overallApprovalRate: number;
  mostViewedSchemes: { schemeId: string; title: string; views: number }[];
  mostAppliedSchemes: { schemeId: string; title: string; applications: number; approvalRate: number }[];
  stateWiseAdoption: { state: string; applications: number }[];
  applicationTrends: { month: string; count: number }[];
}

// ── Notifications ─────────────────────────────────────────────
export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  unreadCount: number;
  deliveryRate: number;
  readRate: number;
  typeBreakdown: { type: string; count: number; readRate: number }[];
  engagementTrends: { month: string; sent: number; read: number }[];
}

// ── Dashboard ─────────────────────────────────────────────────
export interface FarmerDashboard {
  myFarms: {
    total: number;
    totalAreaAcres: number;
    farms: { farmId: string; name: string; location: string; areaAcres: number }[];
  };
  myRecommendations: {
    total: number;
    recent: { recommendationId: string; cropName: string; confidenceScore: number; createdAt: Date }[];
  };
  myDiseaseReports: {
    total: number;
    pending: number;
    verified: number;
    recent: { reportId: string; diseaseName: string; severity: string; status: string; createdAt: Date }[];
  };
  myNotifications: {
    total: number;
    unread: number;
    recent: { notificationId: string; title: string; type: string; isRead: boolean; createdAt: Date }[];
  };
}

export interface AdminDashboard {
  overview: OverviewMetrics;
  farmAnalytics: Pick<FarmAnalytics, 'totalFarms' | 'farmsByState' | 'soilTypeDistribution'>;
  cropAnalytics: Pick<CropAnalytics, 'totalRecommendations' | 'mostRecommendedCrops'>;
  diseaseAnalytics: Pick<DiseaseAnalytics, 'totalReports' | 'mostCommonDiseases' | 'severityBreakdown'>;
  marketAnalytics: Pick<MarketAnalytics, 'trackedCommodities' | 'topCommodities'>;
  schemeAnalytics: Pick<SchemeAnalytics, 'totalApplications' | 'overallApprovalRate'>;
  notificationAnalytics: Pick<NotificationAnalytics, 'totalSent' | 'readRate' | 'deliveryRate'>;
}

export interface DashboardAnalytics {
  role: 'farmer' | 'consultant' | 'fpo_manager' | 'admin';
  farmer?: FarmerDashboard;
  admin?: AdminDashboard;
}

// ── AI-ready prediction stubs ─────────────────────────────────
export interface PredictiveAnalyticsInput {
  userId?: string;
  farmId?: string;
  state?: string;
  district?: string;
  season?: string;
  historicalWindow?: number; // days
}

export interface RiskScore {
  userId: string;
  farmId?: string;
  diseaseRisk: number; // 0-100
  marketRisk: number;
  yieldRisk: number;
  overallRisk: number;
  factors: string[];
}
