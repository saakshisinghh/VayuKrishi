import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum Severity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

export enum DetectionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AiProvider {
  MOCK = 'mock',
  FASTAPI = 'fastapi',
}

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface ITreatmentStep {
  step: number;
  action: string;
  product: string;
  quantity: string;
}

export interface IDiseaseAnalysis {
  diseaseName: string;
  confidence: number;          // 0 – 100
  severity: Severity;
  affectedArea: number;        // percentage 0 – 100
  cause: string;
  treatmentPlan: ITreatmentStep[];
  preventiveMeasures: string[];
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IDiseaseReport extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  farmId: Types.ObjectId;
  mediaId: Types.ObjectId;
  cropName: string;
  analysis: IDiseaseAnalysis | null;
  status: DetectionStatus;
  aiProvider: AiProvider;
  processingTime: number | null;   // milliseconds
  verifiedByExpert: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const TreatmentStepSchema = new Schema<ITreatmentStep>(
  {
    step:     { type: Number,  required: true, min: 1 },
    action:   { type: String,  required: true, trim: true },
    product:  { type: String,  required: true, trim: true },
    quantity: { type: String,  required: true, trim: true },
  },
  { _id: false },
);

const DiseaseAnalysisSchema = new Schema<IDiseaseAnalysis>(
  {
    diseaseName:       { type: String,   required: true, trim: true },
    confidence:        { type: Number,   required: true, min: 0, max: 100 },
    severity:          { type: String,   required: true, enum: Object.values(Severity) },
    affectedArea:      { type: Number,   required: true, min: 0, max: 100 },
    cause:             { type: String,   required: true, trim: true },
    treatmentPlan:     { type: [TreatmentStepSchema], required: true },
    preventiveMeasures:{ type: [String], required: true },
  },
  { _id: false },
);

const DiseaseReportSchema = new Schema<IDiseaseReport>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: 'User',  required: true, index: true },
    farmId:          { type: Schema.Types.ObjectId, ref: 'Farm',  required: true, index: true },
    mediaId:         { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    cropName:        { type: String, required: true, trim: true, index: true },
    analysis:        { type: DiseaseAnalysisSchema, default: null },
    status:          { type: String, enum: Object.values(DetectionStatus), default: DetectionStatus.PENDING, index: true },
    aiProvider:      { type: String, enum: Object.values(AiProvider),      default: AiProvider.MOCK },
    processingTime:  { type: Number, default: null },
    verifiedByExpert:{ type: Boolean, default: false },
    isDeleted:       { type: Boolean, default: false, index: true },
    deletedAt:       { type: Date,    default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  },
);

// ─── Compound Indexes (analytics readiness) ───────────────────────────────────
DiseaseReportSchema.index({ userId: 1, createdAt: -1 });
DiseaseReportSchema.index({ farmId: 1, createdAt: -1 });
DiseaseReportSchema.index({ cropName: 1, 'analysis.severity': 1 });
DiseaseReportSchema.index({ 'analysis.diseaseName': 1, createdAt: -1 });
DiseaseReportSchema.index({ isDeleted: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────
const DiseaseReport = mongoose.model<IDiseaseReport>('DiseaseReport', DiseaseReportSchema);
export default DiseaseReport;
