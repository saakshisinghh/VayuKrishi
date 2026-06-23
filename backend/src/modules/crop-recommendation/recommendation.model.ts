import mongoose, { Document, Schema } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Season = 'kharif' | 'rabi' | 'zaid';
export type RiskLevel = 'low' | 'medium' | 'high';
export type RecommendationStatus = 'pending' | 'completed' | 'failed';

export type SoilType =
  | 'black'
  | 'red'
  | 'alluvial'
  | 'laterite'
  | 'sandy'
  | 'clay'
  | 'loamy';

export type WaterSource =
  | 'rainfed'
  | 'canal'
  | 'borewell'
  | 'drip'
  | 'sprinkler';

// ─── Sub-document Interfaces ─────────────────────────────────────────────────

export interface IInputLocation {
  village: string;
  district: string;
  state: string;
  country: string;
}

export interface IInputData {
  soilType: SoilType;
  totalArea: number;
  waterSource: WaterSource;
  location: IInputLocation;
  season: Season;
}

export interface ICropRecommendation {
  rank: number;
  cropName: string;
  variety: string;
  confidenceScore: number;   // 0–100
  expectedYield: string;     // e.g. "25 quintal/acre"
  expectedProfit: string;    // e.g. "₹80000"
  riskLevel: RiskLevel;
  reasoning: string;
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  farmId: mongoose.Types.ObjectId;
  season: Season;
  year: number;
  inputData: IInputData;
  recommendations: ICropRecommendation[];
  aiProvider: string;
  processingTime: number;   // milliseconds
  status: RecommendationStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const InputLocationSchema = new Schema<IInputLocation>(
  {
    village:  { type: String, default: '' },
    district: { type: String, default: '' },
    state:    { type: String, default: '' },
    country:  { type: String, default: 'India' },
  },
  { _id: false }
);

const InputDataSchema = new Schema<IInputData>(
  {
    soilType:   {
      type: String,
      enum: ['black', 'red', 'alluvial', 'laterite', 'sandy', 'clay', 'loamy'],
      required: true,
    },
    totalArea:   { type: Number, required: true },
    waterSource: {
      type: String,
      enum: ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler'],
      required: true,
    },
    location: { type: InputLocationSchema, required: true },
    season:   {
      type: String,
      enum: ['kharif', 'rabi', 'zaid'],
      required: true,
    },
  },
  { _id: false }
);

const CropRecommendationSchema = new Schema<ICropRecommendation>(
  {
    rank:            { type: Number, required: true },
    cropName:        { type: String, required: true, trim: true },
    variety:         { type: String, trim: true, default: '' },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    expectedYield:   { type: String, default: '' },
    expectedProfit:  { type: String, default: '' },
    riskLevel:       {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    reasoning:       { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const RecommendationSchema = new Schema<IRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farmId: {
      type: Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid'],
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    inputData:       { type: InputDataSchema, required: true },
    recommendations: { type: [CropRecommendationSchema], default: [] },
    aiProvider:      { type: String, default: 'mock', trim: true },
    processingTime:  { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for common access patterns
RecommendationSchema.index({ userId: 1, createdAt: -1 });
RecommendationSchema.index({ userId: 1, season: 1 });
RecommendationSchema.index({ userId: 1, year: 1 });
RecommendationSchema.index({ farmId: 1, season: 1 });

export const Recommendation = mongoose.model<IRecommendation>(
  'Recommendation',
  RecommendationSchema
);
