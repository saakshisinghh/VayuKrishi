import { Schema, model, Document, Types } from 'mongoose';
import { ResourceType, UploadCategory } from './types/upload.types';

// =============================================
// INTERFACE
// =============================================

export interface IMediaDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  farmId?: Types.ObjectId;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  publicId: string;
  resourceType: ResourceType;
  category: UploadCategory;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================
// SCHEMA
// =============================================

const mediaSchema = new Schema<IMediaDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    farmId: {
      type: Schema.Types.ObjectId,
      ref: 'Farm',
      default: null,
      index: true,
    },

    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },

    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
      maxlength: [255, 'Original name cannot exceed 255 characters'],
    },

    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },

    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be positive'],
    },

    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      unique: true,
      trim: true,
    },

    resourceType: {
      type: String,
      enum: Object.values(ResourceType),
      required: [true, 'Resource type is required'],
      index: true,
    },

    category: {
      type: String,
      enum: Object.values(UploadCategory),
      required: [true, 'Upload category is required'],
      index: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  }
);

// =============================================
// COMPOUND INDEXES
// =============================================

mediaSchema.index({ userId: 1, category: 1 });
mediaSchema.index({ userId: 1, resourceType: 1 });
mediaSchema.index({ userId: 1, createdAt: -1 });
mediaSchema.index({ farmId: 1, category: 1 });

// =============================================
// VIRTUAL: fileSizeFormatted
// =============================================

mediaSchema.virtual('fileSizeFormatted').get(function () {
  const bytes = this.fileSize;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
});

export const Media = model<IMediaDocument>('Media', mediaSchema);
