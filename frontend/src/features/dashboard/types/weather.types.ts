export type WeatherCondition =
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "rainy"
  | "thunderstorm"
  | "foggy"
  | "hazy"
  | "windy";

export type Season = "kharif" | "rabi" | "zaid";
export type SowingWindow = "open" | "optimal" | "marginal" | "closed";

export interface WeatherData {
  location: string;
  district: string;
  state: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  conditionLabel: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainProbability: number;
  uvIndex: number;
  visibility: number;
  season: Season;
  sowingWindow: SowingWindow;
  sowingRecommendation: string;
  forecast: HourlyForecast[];
  weeklyForecast: DailyForecast[];
  lastUpdated: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  rainProbability: number;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  rainProbability: number;
}
