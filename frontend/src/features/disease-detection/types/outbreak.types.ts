export interface OutbreakRisk {
  id: string;
  diseaseName: string;
  distance: number;
  distanceUnit: "km" | "miles";
  riskLevel: "low" | "medium" | "high" | "critical";
  affectedRegion: string;
  affectedCrops: string[];
  reportedCases: number;
  lastUpdated: string;
  direction: string;
}

export interface WeatherImpact {
  current: WeatherCondition;
  forecast: WeatherForecast[];
  diseaseSpreadRisk: DiseaseSpreadRisk;
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  unit: {
    temperature: "celsius" | "fahrenheit";
    rainfall: "mm" | "inches";
    windSpeed: "kmh" | "mph";
  };
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  rainfall: number;
  spreadRisk: "low" | "medium" | "high";
}

export interface DiseaseSpreadRisk {
  overall: "low" | "medium" | "high" | "critical";
  score: number;
  factors: SpreadFactor[];
  recommendation: string;
}

export interface SpreadFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
}
