import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum ApplicationStatus {
  DRAFT        = 'draft',
  SUBMITTED    = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED     = 'approved',
  REJECTED     = 'rejected',
  CLOSED       = 'closed',
}

// ─── Sub-document ─────────────────────────────────────────────────────────────

export interface ISubmittedDocument {
  name:    string;
  mediaId: Types.ObjectId;
  url:     string;
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IApplication extends Document {
  _id:                Types.ObjectId;
  userId:             Types.ObjectId;
  schemeId:           Types.ObjectId;
  farmId:             Types.ObjectId | null;
  status:             ApplicationStatus;
  submittedDocuments: ISubmittedDocument[];
  remarks:            string;
  eligibilityScore:   number | null;
  appliedAt:          Date | null;
  approvedAt:         Date | null;
  rejectedAt:         Date | null;
  isDeleted:          boolean;
  deletedAt:          Date | null;
  createdAt:          Date;
  updatedAt:          Date;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const SubmittedDocumentSchema = new Schema<ISubmittedDocument>(
  {
    name:    { type: String, required: true, trim: true },
    mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    url:     { type: String, required: true },
  },
  { _id: false },
);

const ApplicationSchema = new Schema<IApplication>(
  {
    userId:             { type: Schema.Types.ObjectId, ref: 'User',   required: true, index: true },
    schemeId:           { type: Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
    farmId:             { type: Schema.Types.ObjectId, ref: 'Farm',   default: null },
    status:             { type: String, enum: Object.values(ApplicationStatus), default: ApplicationStatus.DRAFT, index: true },
    submittedDocuments: { type: [SubmittedDocumentSchema], default: [] },
    remarks:            { type: String, default: '', trim: true },
    eligibilityScore:   { type: Number, default: null },
    appliedAt:          { type: Date,   default: null },
    approvedAt:         { type: Date,   default: null },
    rejectedAt:         { type: Date,   default: null },
    isDeleted:          { type: Boolean, default: false },
    deletedAt:          { type: Date,    default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => { (ret as Record<string, unknown>).__v = undefined; return ret; },
    },
  },
);

// ─── Compound indexes (analytics) ────────────────────────────────────────────
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ schemeId: 1, status: 1 });
ApplicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
ApplicationSchema.index({ createdAt: -1 });

const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application;
