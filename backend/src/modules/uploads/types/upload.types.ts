import { Types } from 'mongoose';

// =============================================
// ENUMS
// =============================================

export enum ResourceType {
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

export enum UploadCategory {
  PROFILE = 'profile',
  DISEASE = 'disease',
  VOICE = 'voice',
  REPORT = 'report',
  FARM_DOCUMENT = 'farm-document',
  GENERAL = 'general',
}

export enum CloudinaryFolder {
  DISEASE_IMAGES = 'vayukrishi/disease-images',
  VOICE_RECORDINGS = 'vayukrishi/voice-recordings',
  PROFILE_IMAGES = 'vayukrishi/profile-images',
  REPORTS = 'vayukrishi/reports',
  FARM_DOCUMENTS = 'vayukrishi/farm-documents',
  GENERAL = 'vayukrishi/general',
}

// =============================================
// ALLOWED FILE TYPES
// =============================================

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

// =============================================
// FILE SIZE LIMITS (bytes)
// =============================================

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,    // 10MB
  AUDIO: 25 * 1024 * 1024,    // 25MB
  DOCUMENT: 15 * 1024 * 1024, // 15MB
} as const;

// =============================================
// INTERFACES
// =============================================

export interface IMedia {
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

export interface IUploadImageDto {
  userId: string;
  farmId?: string;
  category?: UploadCategory;
  file: Express.Multer.File;
}

export interface IUploadAudioDto {
  userId: string;
  farmId?: string;
  category?: UploadCategory;
  file: Express.Multer.File;
}

export interface IUploadDocumentDto {
  userId: string;
  farmId?: string;
  category?: UploadCategory;
  file: Express.Multer.File;
}

export interface IGetUserFilesDto {
  userId: string;
  page?: number;
  limit?: number;
  category?: UploadCategory;
  resourceType?: ResourceType;
}

export interface ICloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  original_filename: string;
}

export interface ICreateMediaDto {
  userId: string;
  farmId?: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  publicId: string;
  resourceType: ResourceType;
  category: UploadCategory;
}

// =============================================
// JWT PAYLOAD (carried forward from Phase 2)
// =============================================

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}


