import type { WeatherData } from "../types/weather.types";
import type { MarketData } from "../types/market.types";
import type { FarmHealthData } from "../types/health.types";
import type { DashboardOverview } from "../types/dashboard.types";

// Simulated API delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchWeatherData(): Promise<WeatherData> {
  await delay(600);
  return {
    location: "Vidarbha",
    district: "Nagpur",
    state: "Maharashtra",
    temperature: 34,
    feelsLike: 38,
    condition: "partly_cloudy",
    conditionLabel: "Partly Cloudy",
    humidity: 62,
    windSpeed: 14,
    windDirection: "SW",
    rainProbability: 40,
    uvIndex: 7,
    visibility: 8.4,
    season: "kharif",
    sowingWindow: "open",
    sowingRecommendation: "Conditions favorable for Soybean and Cotton sowing",
    forecast: [
      { time: "12:00", temperature: 35, condition: "partly_cloudy", rainProbability: 20 },
      { time: "15:00", temperature: 37, condition: "cloudy", rainProbability: 45 },
      { time: "18:00", temperature: 33, condition: "rainy", rainProbability: 70 },
      { time: "21:00", temperature: 28, condition: "cloudy", rainProbability: 30 },
      { time: "00:00", temperature: 25, condition: "clear", rainProbability: 10 },
      { time: "03:00", temperature: 23, condition: "clear", rainProbability: 5 },
    ],
    weeklyForecast: [
      { date: "Mon", high: 35, low: 24, condition: "partly_cloudy", rainProbability: 30 },
      { date: "Tue", high: 33, low: 23, condition: "rainy", rainProbability: 75 },
      { date: "Wed", high: 30, low: 22, condition: "rainy", rainProbability: 80 },
      { date: "Thu", high: 32, low: 23, condition: "cloudy", rainProbability: 50 },
      { date: "Fri", high: 34, low: 24, condition: "partly_cloudy", rainProbability: 25 },
      { date: "Sat", high: 36, low: 25, condition: "clear", rainProbability: 10 },
      { date: "Sun", high: 37, low: 26, condition: "clear", rainProbability: 5 },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchMarketData(): Promise<MarketData> {
  await delay(800);

  const generateHistory = (base: number, days: number) =>
    Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toISOString().split("T")[0],
      price: base + (Math.random() - 0.5) * base * 0.15,
    }));

  return {
    topCrops: [
      {
        cropId: "soybean",
        cropName: "Soybean",
        currentPrice: 4280,
        unit: "quintal",
        change7d: 120,
        change7dPercent: 2.88,
        change30d: 340,
        change30dPercent: 8.63,
        trend: "up",
        priceHistory: generateHistory(4280, 30),
        forecast30d: generateHistory(4450, 30),
        market: "Nagpur APMC",
      },
      {
        cropId: "cotton",
        cropName: "Cotton",
        currentPrice: 6850,
        unit: "quintal",
        change7d: -90,
        change7dPercent: -1.3,
        change30d: 210,
        change30dPercent: 3.16,
        trend: "stable",
        priceHistory: generateHistory(6850, 30),
        forecast30d: generateHistory(7000, 30),
        market: "Wardha APMC",
      },
      {
        cropId: "tur_dal",
        cropName: "Tur Dal",
        currentPrice: 8200,
        unit: "quintal",
        change7d: 450,
        change7dPercent: 5.8,
        change30d: 1100,
        change30dPercent: 15.5,
        trend: "up",
        priceHistory: generateHistory(8200, 30),
        forecast30d: generateHistory(8600, 30),
        market: "Akola APMC",
      },
    ],
    lastUpdated: new Date().toISOString(),
    marketSentiment: "bullish",
  };
}

export async function fetchFarmHealthData(): Promise<FarmHealthData> {
  await delay(500);
  return {
    overallScore: 74,
    grade: "B",
    trend: 6,
    lastAssessed: new Date(Date.now() - 3 * 86400000).toISOString(),
    nextAssessmentDue: new Date(Date.now() + 4 * 86400000).toISOString(),
    breakdown: [
      {
        id: "soil",
        label: "Soil Quality",
        score: 82,
        weight: 0.3,
        status: "good",
        trend: "improving",
        detail: "pH balanced, good organic matter",
      },
      {
        id: "water",
        label: "Water Efficiency",
        score: 68,
        weight: 0.25,
        status: "fair",
        trend: "stable",
        detail: "Moderate irrigation efficiency",
      },
      {
        id: "disease",
        label: "Disease Risk",
        score: 71,
        weight: 0.25,
        status: "fair",
        trend: "declining",
        detail: "Moderate risk in nearby areas",
      },
      {
        id: "market",
        label: "Market Potential",
        score: 79,
        weight: 0.2,
        status: "good",
        trend: "improving",
        detail: "Strong demand for current crops",
      },
    ],
    recommendations: [
      "Increase irrigation efficiency by 15%",
      "Apply fungicide preventively",
      "Consider crop diversification",
    ],
  };
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  await delay(400);
  return {
    farmSnapshot: {
      activeCrop: "Soybean",
      activeCropStage: "Vegetative",
      projectedProfit: 142000,
      projectedProfitTrend: 12.4,
      farmHealthScore: 74,
      farmHealthTrend: 6,
      diseaseRisk: "moderate",
      diseaseRiskScore: 42,
      lastUpdated: new Date().toISOString(),
    },
    aiRecommendations: [
      {
        id: "rec-1",
        recommendedCrop: "Tur Dal",
        expectedProfit: 168000,
        riskScore: 28,
        confidenceScore: 87,
        reasoning:
          "High market demand combined with favorable soil conditions and historical performance in your region makes Tur Dal the highest-potential crop for Kharif 2025.",
        keyFactors: ["Market demand +15.5%", "Soil compatibility 91%", "Water requirement low"],
        season: "Kharif 2025",
        soilCompatibility: 91,
        marketDemand: "high",
      },
      {
        id: "rec-2",
        recommendedCrop: "Cotton",
        expectedProfit: 155000,
        riskScore: 35,
        confidenceScore: 79,
        reasoning:
          "Stable pricing and strong export demand. Cotton suits your farm's irrigation setup and current soil quality.",
        keyFactors: ["Stable pricing", "Export demand high", "Irrigation ready"],
        season: "Kharif 2025",
        soilCompatibility: 85,
        marketDemand: "high",
      },
    ],
    diseaseAlerts: [
      {
        id: "alert-1",
        diseaseName: "Yellow Mosaic Virus",
        riskLevel: "moderate",
        affectedCrop: "Soybean",
        affectedAreaKm: 12,
        distanceFromFarm: 8,
        recommendedAction: "Apply systemic insecticide to control whitefly vector",
        reportedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "alert-2",
        diseaseName: "Leaf Curl Disease",
        riskLevel: "low",
        affectedCrop: "Cotton",
        affectedAreaKm: 5,
        distanceFromFarm: 22,
        recommendedAction: "Monitor closely, no immediate action needed",
        reportedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    schemes: [
      {
        id: "pm-kisan",
        name: "PM-KISAN",
        matchScore: 94,
        potentialBenefit: 6000,
        benefitType: "cash",
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        isEligible: true,
      },
      {
        id: "pmfby",
        name: "PM Fasal Bima Yojana",
        matchScore: 88,
        potentialBenefit: 35000,
        benefitType: "insurance",
        deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
        isEligible: true,
      },
      {
        id: "kcc",
        name: "Kisan Credit Card",
        matchScore: 76,
        potentialBenefit: 300000,
        benefitType: "loan",
        deadline: null,
        isEligible: true,
      },
    ],
  };
}
