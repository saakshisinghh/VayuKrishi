/**
 * modules/users/repositories/user.repository.ts
 * ----------------------------------------------------
 * Data-access layer for the User collection. Services should never
 * import the Mongoose model directly — they go through this repository.
 * This keeps persistence concerns isolated and makes the service layer
 * easy to unit test with a mocked repository.
 */

import { Types } from 'mongoose';
import { UserModel, IUser } from '../user.model';
import { UpdateProfileDto } from '../types/user.types';

export class UserRepository {
  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findByMobile(mobile: string): Promise<IUser | null> {
    return UserModel.findOne({ mobile });
  }

  /**
   * Finds a user by email AND explicitly includes the password field,
   * which is excluded by default (select: false on the schema).
   * Used only by the login flow.
   */
  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select('+password');
  }

  async findByIdWithRefreshToken(id: string | Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id).select('+refreshToken');
  }

  async create(data: {
    name: string;
    mobile: string;
    email?: string;
    password: string;
  }): Promise<IUser> {
    return UserModel.create(data);
  }

  async setRefreshToken(id: string | Types.ObjectId, token: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken: token });
  }

  async updateProfile(id: string | Types.ObjectId, data: UpdateProfileDto): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

export const userRepository = new UserRepository();
