/**
 * modules/auth/repositories/auth.repository.ts
 * -----------------------------------------------------
 * Data-access layer for auth flows. Wraps the User model (via auth.model.ts)
 * for the specific queries the auth service needs.
 *
 * Refresh tokens are stored in TWO places by design:
 *  1. Redis (REDIS_KEYS.refreshToken) — fast lookup/TTL-based auto-expiry,
 *     used as the primary source of truth for "is this refresh token valid".
 *  2. The User document's `refreshToken` field — a durable fallback/audit
 *     trail, and what lets `logout` reliably clear state even if Redis
 *     were ever flushed.
 */

import { Types } from 'mongoose';
import { UserModel, IUser } from '../auth.model';

export interface CreateUserData {
  name: string;
  mobile: string;
  password: string;
  language: string;
  isVerified: boolean;
  profile: {
    state: string;
    district: string;
    village?: string;
    landSizeAcres?: number;
    soilType?: string;
  };
}

export class AuthRepository {
  async findByMobile(mobile: string): Promise<IUser | null> {
    return UserModel.findOne({ mobile });
  }

  async findByMobileWithPassword(mobile: string): Promise<IUser | null> {
    return UserModel.findOne({ mobile }).select('+password');
  }

  async findByIdWithRefreshToken(id: string | Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id).select('+refreshToken');
  }

  async createUser(data: CreateUserData): Promise<IUser> {
    return UserModel.create(data);
  }

  async setRefreshToken(id: string | Types.ObjectId, token: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken: token });
  }

  async markVerified(id: string | Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { isVerified: true });
  }

  async updatePassword(id: string | Types.ObjectId, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }
}

export const authRepository = new AuthRepository();
