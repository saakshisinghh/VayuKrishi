// ─── Profit Simulation Types ──────────────────────────────────────────────────

export interface CropProfitMetrics {
  cropId: string;
  cropName: string;
  inputCost: number;
  revenue: number;
  profit: number;
  roi: number;           // percentage
  riskLevel: 'low' | 'medium' | 'high';
  breakEvenYield: number;
  netProfitMargin: number;
}

export interface ProfitSimulationRequest {
  cropIds: string[];
  landSize: number;
  landUnit: string;
}

export interface ProfitSimulationResponse {
  crops: CropProfitMetrics[];
  bestCrop: string;
  simulatedAt: string;
}

export interface ProfitForecastPoint {
  month: string;
  projected: number;
  optimistic: number;
  pessimistic: number;
}

export interface ProfitForecast {
  cropId: string;
  cropName: string;
  forecast: ProfitForecastPoint[];
}

export interface MarketPrice {
  cropId: string;
  cropName: string;
  currentPrice: number;       // INR per quintal
  unit: string;
  lastUpdated: string;
  weeklyForecast: PriceForecastPoint[];
  monthlyForecast: PriceForecastPoint[];
  demandScore: number;        // 0–100
  supplyScore: number;        // 0–100
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface PriceForecastPoint {
  date: string;
  price: number;
  confidence: number;
}
