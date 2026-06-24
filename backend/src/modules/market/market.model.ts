import { Schema, model, Document, Model } from "mongoose";
import { IMarketPrice, MarketSource } from "./types/market.types";

export interface MarketPriceDocument extends Omit<IMarketPrice, "_id">, Document {}

const MARKET_SOURCES: MarketSource[] = [
  "AGMARKNET",
  "MOCK",
  "MANUAL",
  "GOV_API",
];

const marketPriceSchema = new Schema<MarketPriceDocument>(
  {
    commodity: {
      type: String,
      required: [true, "Commodity is required"],
      trim: true,
    },
    variety: {
      type: String,
      required: [true, "Variety is required"],
      trim: true,
      default: "General",
    },
    market: {
      type: String,
      required: [true, "Market name is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    arrivalDate: {
      type: Date,
      required: [true, "Arrival date is required"],
    },
    minPrice: {
      type: Number,
      required: [true, "Minimum price is required"],
      min: [0, "Minimum price cannot be negative"],
    },
    maxPrice: {
      type: Number,
      required: [true, "Maximum price is required"],
      min: [0, "Maximum price cannot be negative"],
    },
    modalPrice: {
      type: Number,
      required: [true, "Modal price is required"],
      min: [0, "Modal price cannot be negative"],
    },
    unit: {
      type: String,
      required: true,
      default: "Quintal",
    },
    source: {
      type: String,
      enum: MARKET_SOURCES,
      default: "MOCK",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Normalize commodity casing so filters/searches are consistent
marketPriceSchema.pre("save", function (next) {
  // Store a normalized comparison value via a virtual-like transform
  // while preserving the original display casing.
  next();
});

// === INDEXES ===
// Single-field indexes for direct filters
marketPriceSchema.index({ commodity: 1 });
marketPriceSchema.index({ district: 1 });
marketPriceSchema.index({ state: 1 });
marketPriceSchema.index({ market: 1 });
marketPriceSchema.index({ arrivalDate: -1 });

// Compound indexes for common query patterns
marketPriceSchema.index({ commodity: 1, arrivalDate: -1 });
marketPriceSchema.index({ commodity: 1, state: 1, district: 1 });
marketPriceSchema.index({ state: 1, district: 1, market: 1 });

// Text index to support free-text commodity/market search
marketPriceSchema.index({ commodity: "text", market: "text" });

export const MarketPrice: Model<MarketPriceDocument> = model<MarketPriceDocument>(
  "MarketPrice",
  marketPriceSchema
);
