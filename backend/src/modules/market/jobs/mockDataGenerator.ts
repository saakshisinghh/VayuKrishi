import { IMarketPrice, MarketSource } from "../types/market.types";

export const SUPPORTED_COMMODITIES = [
  "Cotton",
  "Soybean",
  "Wheat",
  "Rice",
  "Sugarcane",
  "Maize",
  "Groundnut",
  "Turmeric",
  "Onion",
  "Tomato",
] as const;

const MARKETS: { market: string; district: string; state: string }[] = [
  { market: "Yavatmal Mandi", district: "Yavatmal", state: "Maharashtra" },
  { market: "Akola Mandi", district: "Akola", state: "Maharashtra" },
  { market: "Indore Mandi", district: "Indore", state: "Madhya Pradesh" },
  { market: "Kota Mandi", district: "Kota", state: "Rajasthan" },
  { market: "Karnal Mandi", district: "Karnal", state: "Haryana" },
  { market: "Guntur Mandi", district: "Guntur", state: "Andhra Pradesh" },
  { market: "Erode Mandi", district: "Erode", state: "Tamil Nadu" },
  { market: "Nashik Mandi", district: "Nashik", state: "Maharashtra" },
  { market: "Lasalgaon Mandi", district: "Nashik", state: "Maharashtra" },
  { market: "Hubli Mandi", district: "Dharwad", state: "Karnataka" },
];

const BASE_PRICE_BY_COMMODITY: Record<string, number> = {
  Cotton: 7200,
  Soybean: 4600,
  Wheat: 2300,
  Rice: 2800,
  Sugarcane: 320,
  Maize: 2000,
  Groundnut: 6100,
  Turmeric: 14500,
  Onion: 1800,
  Tomato: 1500,
};

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates realistic-looking mock mandi price records.
 * This is a stand-in for the future Agmarknet / government mandi API
 * integration — `syncMarketData()` in the service layer can swap this
 * generator for a real HTTP client call without touching callers.
 */
export function generateMockMarketData(
  commodities: string[] = [...SUPPORTED_COMMODITIES],
  recordCount = 25,
  source: MarketSource = "MOCK"
): IMarketPrice[] {
  const records: IMarketPrice[] = [];

  for (let i = 0; i < recordCount; i++) {
    const commodity = pickRandom(commodities);
    const location = pickRandom(MARKETS);
    const base = BASE_PRICE_BY_COMMODITY[commodity] ?? 2000;

    const modalPrice = randomBetween(
      Math.round(base * 0.9),
      Math.round(base * 1.1)
    );
    const minPrice = Math.round(modalPrice * 0.92);
    const maxPrice = Math.round(modalPrice * 1.08);

    records.push({
      commodity,
      variety: "General",
      market: location.market,
      district: location.district,
      state: location.state,
      arrivalDate: new Date(),
      minPrice,
      maxPrice,
      modalPrice,
      unit: "Quintal",
      source,
    });
  }

  return records;
}
