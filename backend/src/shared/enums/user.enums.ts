/**
 * shared/enums/user.enums.ts
 * --------------------------
 * Enumerations shared across the auth and users modules (and any
 * future module that needs to know about roles/languages).
 */

export enum UserRole {
  FARMER = 'farmer',
  CONSULTANT = 'consultant',
  FPO_MANAGER = 'fpo_manager',
  GOVERNMENT_OFFICER = 'government_officer',
  ADMIN = 'admin',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
  MR = 'mr',
  GU = 'gu',
  TA = 'ta',
  KN = 'kn',
}

export enum SoilType {
  ALLUVIAL = 'alluvial',
  BLACK = 'black',
  RED = 'red',
  LATERITE = 'laterite',
  DESERT = 'desert',
  MOUNTAIN = 'mountain',
  SALINE = 'saline',
  PEATY = 'peaty',
}

export enum OTPPurpose {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
}

export const USER_ROLES = Object.values(UserRole);
export const LANGUAGES = Object.values(Language);
export const SOIL_TYPES = Object.values(SoilType);
