import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum SchemeCategory {
  SUBSIDY         = 'Subsidy',
  INSURANCE       = 'Insurance',
  EQUIPMENT       = 'Equipment',
  LOAN            = 'Loan',
  TRAINING        = 'Training',
  IRRIGATION      = 'Irrigation',
  ORGANIC_FARMING = 'Organic Farming',
  SEED_SUPPORT    = 'Seed Support',
  WOMEN_FARMERS   = 'Women Farmers',
  FPO_SUPPORT     = 'FPO Support',
}

export enum FarmerCategory {
  SMALL      = 'small',       // < 2 hectares
  MARGINAL   = 'marginal',    // < 1 hectare
  MEDIUM     = 'medium',      // 2–10 hectares
  LARGE      = 'large',       // > 10 hectares
  ALL        = 'all',
}

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface IEligibilityCriteria {
  states:             string[];          // empty = all states
  minFarmSize:        number | null;     // hectares
  maxFarmSize:        number | null;
  farmerCategories:   FarmerCategory[];  // empty = all
  cropTypes:          string[];          // empty = all
  waterSources:       string[];          // e.g. ['rainwater', 'canal']
  minAge:             number | null;
  maxAge:             number | null;
  genderRestriction:  'male' | 'female' | 'any';
  incomeLimitAnnual:  number | null;     // INR
  additionalCriteria: string[];          // free-text rules for display
}

export interface IBenefit {
  type:        string;   // e.g. "Financial Assistance", "Subsidy"
  description: string;
  amount:      number | null;
  unit:        string;   // e.g. "INR", "% of cost"
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IScheme extends Document {
  _id:                 Types.ObjectId;
  schemeName:          string;
  schemeCode:          string;
  description:         string;
  benefits:            IBenefit[];
  category:            SchemeCategory;
  targetAudience:      string;
  state:               string;           // 'All' or specific state
  eligibilityCriteria: IEligibilityCriteria;
  requiredDocuments:   string[];
  applicationLink:     string;
  officialWebsite:     string;
  startDate:           Date | null;
  endDate:             Date | null;
  isActive:            boolean;
  viewCount:           number;           // analytics
  applicationCount:    number;           // analytics
  createdAt:           Date;
  updatedAt:           Date;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const BenefitSchema = new Schema<IBenefit>(
  {
    type:        { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    amount:      { type: Number, default: null },
    unit:        { type: String, default: '' },
  },
  { _id: false },
);

const EligibilityCriteriaSchema = new Schema<IEligibilityCriteria>(
  {
    states:             { type: [String], default: [] },
    minFarmSize:        { type: Number,   default: null },
    maxFarmSize:        { type: Number,   default: null },
    farmerCategories:   { type: [String], default: [] },
    cropTypes:          { type: [String], default: [] },
    waterSources:       { type: [String], default: [] },
    minAge:             { type: Number,   default: null },
    maxAge:             { type: Number,   default: null },
    genderRestriction:  { type: String,   default: 'any', enum: ['male', 'female', 'any'] },
    incomeLimitAnnual:  { type: Number,   default: null },
    additionalCriteria: { type: [String], default: [] },
  },
  { _id: false },
);

const SchemeSchema = new Schema<IScheme>(
  {
    schemeName:          { type: String, required: true, trim: true },
    schemeCode:          { type: String, required: true, trim: true, unique: true, uppercase: true },
    description:         { type: String, required: true, trim: true },
    benefits:            { type: [BenefitSchema], default: [] },
    category:            { type: String, required: true, enum: Object.values(SchemeCategory), index: true },
    targetAudience:      { type: String, required: true, trim: true },
    state:               { type: String, required: true, trim: true, index: true },
    eligibilityCriteria: { type: EligibilityCriteriaSchema, required: true },
    requiredDocuments:   { type: [String], default: [] },
    applicationLink:     { type: String, default: '' },
    officialWebsite:     { type: String, default: '' },
    startDate:           { type: Date,   default: null },
    endDate:             { type: Date,   default: null },
    isActive:            { type: Boolean, default: true, index: true },
    viewCount:           { type: Number,  default: 0 },
    applicationCount:    { type: Number,  default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => { (ret as Record<string, unknown>).__v = undefined; return ret; },
    },
  },
);

// ─── Full-text search index ───────────────────────────────────────────────────
SchemeSchema.index({ schemeName: 'text', description: 'text', targetAudience: 'text' });
SchemeSchema.index({ category: 1, isActive: 1 });
SchemeSchema.index({ state: 1, isActive: 1 });
SchemeSchema.index({ endDate: 1 });

const Scheme = mongoose.model<IScheme>('Scheme', SchemeSchema);
export default Scheme;
