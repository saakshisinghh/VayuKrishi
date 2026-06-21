/**
 * shared/helpers/otp.helper.ts
 * ------------------------------
 * Generates and verifies OTPs stored in Redis, keyed by mobile + purpose.
 * Dev-mode logs the OTP to console instead of sending a real SMS, since
 * no SMS provider is in scope for this phase — swap `sendOtpSms` for a
 * real provider call (e.g. MSG91, Twilio) when ready.
 */

import crypto from 'crypto';
import { redisClient } from '../../config/redis';
import { REDIS_KEYS } from '../constants/app.constants';
import { env, isProduction } from '../../config/env';
import { logger } from '../../config/logger';
import { OTPPurpose } from '../enums/user.enums';

function generateNumericOtp(length: number): string {
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(length, '0');
}

export async function createAndStoreOtp(mobile: string, purpose: OTPPurpose): Promise<{ otp: string; expiresIn: number }> {
  const otp = generateNumericOtp(env.OTP_LENGTH);
  const key = REDIS_KEYS.otp(mobile, purpose);
  await redisClient.set(key, otp, 'EX', env.OTP_EXPIRES_IN_SECONDS);
  return { otp, expiresIn: env.OTP_EXPIRES_IN_SECONDS };
}

export async function verifyOtp(mobile: string, purpose: OTPPurpose, otp: string): Promise<boolean> {
  const key = REDIS_KEYS.otp(mobile, purpose);
  const stored = await redisClient.get(key);
  if (!stored || stored !== otp) return false;
  await redisClient.del(key); // one-time use
  return true;
}

/**
 * Sends the OTP via SMS in production. In development, logs it instead
 * so it can be tested without a real SMS provider configured.
 */
export async function sendOtpSms(mobile: string, otp: string, purpose: OTPPurpose): Promise<void> {
  if (!isProduction) {
    logger.info(`[DEV OTP] mobile=${mobile} purpose=${purpose} otp=${otp}`);
    return;
  }
  // TODO: integrate real SMS provider (e.g. MSG91 / Twilio) here.
  logger.warn(`No SMS provider configured — OTP for ${mobile} was not sent`);
}
