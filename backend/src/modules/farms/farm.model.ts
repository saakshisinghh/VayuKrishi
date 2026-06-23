import mongoose, { Document, Schema } from 'mongoose';

export type AreaUnit = 'acre' | 'hectare';

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

export type CropSeason = 'kharif' | 'rabi' | 'zaid';

export interface IFarmLocation {
  village: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface IFarm extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  location: IFarmLocation;
  totalArea: number;
  areaUnit: AreaUnit;
  soilType: SoilType;
  waterSource: WaterSource;
  currentCrop: string;
  cropSeason: CropSeason;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FarmLocationSchema = new Schema<IFarmLocation>(
  {
    village: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false }
);

const FarmSchema = new Schema<IFarm>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    location: {
      type: FarmLocationSchema,
      required: true,
    },
    totalArea: {
      type: Number,
      required: true,
      min: 0.01,
    },
    areaUnit: {
      type: String,
      enum: ['acre', 'hectare'] as AreaUnit[],
      required: true,
    },
    soilType: {
      type: String,
      enum: ['black', 'red', 'alluvial', 'laterite', 'sandy', 'clay', 'loamy'] as SoilType[],
      required: true,
      index: true,
    },
    waterSource: {
      type: String,
      enum: ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler'] as WaterSource[],
      required: true,
    },
    currentCrop: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
      index: true,
    },
    cropSeason: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid'] as CropSeason[],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for common query patterns
FarmSchema.index({ 'location.state': 1 });
FarmSchema.index({ 'location.district': 1 });
FarmSchema.index({ userId: 1, isActive: 1 });
FarmSchema.index({ userId: 1, createdAt: -1 });
FarmSchema.index({ 'location.state': 1, 'location.district': 1 });

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);
