/**
 * modules/users/types/user.types.ts
 * --------------------------------------
 * DTOs / interfaces used across the users module's service, repository,
 * and controller layers.
 */

import { Language } from '../../../shared/enums/user.enums';

export interface UpdateProfileDto {
  name?: string;
  language?: Language;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: string;
  language: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
