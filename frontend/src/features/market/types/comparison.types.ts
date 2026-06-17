export interface ComparisonMetric {
  label: string;
  key: string;
  format: "currency" | "percent" | "score" | "number";
  higherIsBetter: boolean;
}

export interface CropComparisonData {
  crops: ComparisonCrop[];
  metrics: ComparisonMetric[];
  winner: {
    cropId: string;
    crop: string;
    reasons: string[];
  };
  updatedAt: string;
}

export interface ComparisonCrop {
  cropId: string;
  crop: string;
  emoji: string;
  currentPrice: number;
  forecastPrice7d: number;
  forecastPrice30d: number;
  priceChange7d: number;
  priceChange30d: number;
  demandScore: number;
  riskScore: number;
  profitPotential: number;
  trend: "up" | "down" | "stable";
  recommendation: "buy" | "sell" | "hold";
  chartData: { date: string; price: number }[];
}
