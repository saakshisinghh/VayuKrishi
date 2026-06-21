/**
 * modules/users/user.model.ts
 * --------------------------------
 * Mongoose schema/model for the User collection. Shared by both the
 * auth module (registration/login) and the users module (profile).
 *
 * Notes:
 *  - `password` and `refreshToken` use `select: false` so they are never
 *    returned by default on find/findOne queries — they must be explicitly
 *    requested with .select('+password') when needed (e.g. during login).
 *  - toJSON transform strips sensitive fields as a second layer of defense
 *    in case a query ever does include them.
 */

import { Schema, model, Document, Types } from 'mongoose';
import { UserRole, Language, SoilType } from '../../shared/enums/user.enums';

export interface IUserProfile {
  state: string;
  district: string;
  village?: string;
  pincode?: string;
  landSizeAcres?: number;
  soilType?: SoilType;
  primaryCrops?: string[];
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  mobile: string;
  email?: string;
  password: string;
  role: UserRole;
  language: Language;
  avatar?: string;
  isVerified: boolean;
  refreshToken: string | null;
  profile?: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Mobile number must be 10-15 digits'],
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.FARMER,
    },
    language: {
      type: String,
      enum: Object.values(Language),
      default: Language.EN,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: undefined,
    },
    profile: {
      type: new Schema<IUserProfile>(
        {
          state: { type: String, required: true, trim: true },
          district: { type: String, required: true, trim: true },
          village: { type: String, trim: true },
          pincode: { type: String, trim: true },
          landSizeAcres: { type: Number, min: 0 },
          soilType: { type: String, enum: Object.values(SoilType) },
          primaryCrops: { type: [String], default: undefined },
        },
        { _id: false },
      ),
      required: false,
      default: undefined,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = ret as any;
        delete obj.password;
        delete obj.refreshToken;
        delete obj.__v;
        return obj;
      },
    },
  },
);

// Note: explicit schema.index() calls for email/phone are intentionally
// omitted — `unique: true` on each field above already creates a unique
// index, and declaring both triggers a Mongoose duplicate-index warning.

export const UserModel = model<IUser>('User', userSchema);
