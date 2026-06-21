/**
 * modules/users/services/user.service.ts
 * ---------------------------------------------
 * Business logic for user profile operations. Controllers call this;
 * this calls the repository. Converts Mongoose documents into the
 * plain UserPublicProfile shape the API returns.
 */

import { IUser } from '../user.model';
import { userRepository } from '../repositories/user.repository';
import { UpdateProfileDto, UserPublicProfile } from '../types/user.types';
import { ApiError } from '../../../shared/utils/api-error';

function toPublicProfile(user: IUser): UserPublicProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    role: user.role,
    language: user.language,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserService {
  async getById(userId: string): Promise<UserPublicProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return toPublicProfile(user);
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserPublicProfile> {
    const updated = await userRepository.updateProfile(userId, data);
    if (!updated) {
      throw ApiError.notFound('User not found');
    }
    return toPublicProfile(updated);
  }
}

export const userService = new UserService();
