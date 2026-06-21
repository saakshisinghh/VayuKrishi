/**
 * modules/auth/services/auth.service.ts
 * -----------------------------------------------
 * Core business logic for authentication. Mobile + password + OTP, matching
 * the frontend contract exactly.
 *
 * Flows:
 *  - register: validates no existing user with this mobile, hashes the
 *    password, stashes the pending registration payload in Redis (NOT in
 *    Mongo yet), sends an OTP. The User document is only created once
 *    otp/verify (purpose=register) succeeds.
 *  - login: mobile + password → access token returned in body, refresh
 *    token set as an httpOnly cookie by the controller.
 *  - otp/send: issues a fresh OTP for login / register / forgot_password.
 *  - otp/verify: purpose=register creates the user from the pending
 *    registration payload and logs them in; purpose=login verifies and
 *    logs an existing user in (passwordless path); purpose=forgot_password
 *    just confirms the OTP is valid (actual reset happens via reset-password).
 *  - reset-password: re-verifies OTP, then updates the password.
 *  - refresh: refresh token is read from an httpOnly cookie by the
 *    controller and passed in here; verified by signature AND against the
 *    value stored in Redis/Mongo, so logout can truly revoke it.
 */

import { IUser } from '../auth.model';
import { authRepository } from '../repositories/auth.repository';
import {
  RegisterDto,
  LoginDto,
  OtpVerifyDto,
  ResetPasswordDto,
  AuthResult,
  AuthUserView,
} from '../types/auth.types';
import { ApiError } from '../../../shared/utils/api-error';
import { hashPassword, comparePassword } from '../../../shared/helpers/password.helper';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  durationToSeconds,
} from '../../../shared/helpers/jwt.helper';
import { createAndStoreOtp, verifyOtp, sendOtpSms } from '../../../shared/helpers/otp.helper';
import { redisClient } from '../../../config/redis';
import { REDIS_KEYS } from '../../../shared/constants/app.constants';
import { env } from '../../../config/env';
import { OTPPurpose } from '../../../shared/enums/user.enums';

function toAuthUserView(user: IUser): AuthUserView {
  return {
    id: user._id.toString(),
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    language: user.language,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profile: user.profile,
  };
}

interface PendingRegistration {
  name: string;
  mobile: string;
  language: string;
  password: string; // already hashed
  state: string;
  district: string;
  village?: string;
  landSizeAcres?: number;
  soilType?: string;
}

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = (): number => durationToSeconds(env.JWT_ACCESS_EXPIRES_IN);

export class AuthService {
  /**
   * Issues a fresh access + refresh token pair, persists the refresh token
   * in Redis (with TTL) and on the user document. Returns the refresh
   * token separately so the controller can set it as an httpOnly cookie —
   * it must never be put in a JSON response body.
   */
  private async issueTokens(user: IUser): Promise<{ accessToken: string; expiresIn: number; refreshToken: string }> {
    const payload = { userId: user._id.toString(), role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const ttlSeconds = durationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
    await redisClient.set(REDIS_KEYS.refreshToken(user._id.toString()), refreshToken, 'EX', ttlSeconds);
    await authRepository.setRefreshToken(user._id, refreshToken);

    return { accessToken, expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS(), refreshToken };
  }

  /**
   * Step 1 of registration: validate, hash password, stash pending payload
   * in Redis, send OTP. Does NOT create the User document or issue tokens.
   */
  async register(data: RegisterDto): Promise<{ message: string; mobile: string; otpExpiresIn: number }> {
    const existing = await authRepository.findByMobile(data.mobile);
    if (existing) {
      throw ApiError.conflict('Mobile number is already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const pending: PendingRegistration = {
      name: data.name,
      mobile: data.mobile,
      language: data.language,
      password: hashedPassword,
      state: data.state,
      district: data.district,
      village: data.village,
      landSizeAcres: data.landSizeAcres,
      soilType: data.soilType,
    };

    await redisClient.set(
      REDIS_KEYS.pendingRegistration(data.mobile),
      JSON.stringify(pending),
      'EX',
      env.OTP_EXPIRES_IN_SECONDS,
    );

    const { otp, expiresIn } = await createAndStoreOtp(data.mobile, OTPPurpose.REGISTER);
    await sendOtpSms(data.mobile, otp, OTPPurpose.REGISTER);

    return { message: 'OTP sent successfully', mobile: data.mobile, otpExpiresIn: expiresIn };
  }

  async login(data: LoginDto): Promise<AuthResult & { refreshToken: string }> {
    const user = await authRepository.findByMobileWithPassword(data.mobile);

    if (!user) {
      throw ApiError.unauthorized('Invalid mobile number or password');
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      throw ApiError.unauthorized('Invalid mobile number or password');
    }

    const { accessToken, expiresIn, refreshToken } = await this.issueTokens(user);

    return { user: toAuthUserView(user), tokens: { accessToken, expiresIn }, refreshToken };
  }

  async sendOtp(mobile: string, purpose: OTPPurpose): Promise<{ message: string; otpExpiresIn: number }> {
    if (purpose === OTPPurpose.REGISTER) {
      const pending = await redisClient.get(REDIS_KEYS.pendingRegistration(mobile));
      if (!pending) {
        throw ApiError.badRequest('No pending registration found for this mobile number. Please register again.');
      }
    } else {
      const user = await authRepository.findByMobile(mobile);
      if (!user) {
        throw ApiError.notFound('No account found for this mobile number');
      }
    }

    const { otp, expiresIn } = await createAndStoreOtp(mobile, purpose);
    await sendOtpSms(mobile, otp, purpose);

    return { message: 'OTP sent successfully', otpExpiresIn: expiresIn };
  }

  async verifyOtp(data: OtpVerifyDto): Promise<{ message: string; result?: AuthResult & { refreshToken: string } }> {
    const isValid = await verifyOtp(data.mobile, data.purpose, data.otp);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid or expired OTP');
    }

    if (data.purpose === OTPPurpose.REGISTER) {
      const pendingRaw = await redisClient.get(REDIS_KEYS.pendingRegistration(data.mobile));
      if (!pendingRaw) {
        throw ApiError.badRequest('Registration session expired. Please register again.');
      }
      const pending: PendingRegistration = JSON.parse(pendingRaw);

      const user = await authRepository.createUser({
        name: pending.name,
        mobile: pending.mobile,
        password: pending.password,
        language: pending.language,
        isVerified: true,
        profile: {
          state: pending.state,
          district: pending.district,
          village: pending.village,
          landSizeAcres: pending.landSizeAcres,
          soilType: pending.soilType,
        },
      });

      await redisClient.del(REDIS_KEYS.pendingRegistration(data.mobile));

      const { accessToken, expiresIn, refreshToken } = await this.issueTokens(user);
      return {
        message: 'Registration successful',
        result: { user: toAuthUserView(user), tokens: { accessToken, expiresIn }, refreshToken },
      };
    }

    if (data.purpose === OTPPurpose.LOGIN) {
      const user = await authRepository.findByMobile(data.mobile);
      if (!user) {
        throw ApiError.notFound('No account found for this mobile number');
      }
      const { accessToken, expiresIn, refreshToken } = await this.issueTokens(user);
      return {
        message: 'Login successful',
        result: { user: toAuthUserView(user), tokens: { accessToken, expiresIn }, refreshToken },
      };
    }

    // forgot_password: just confirms the OTP was valid. The frontend follows
    // up with a separate reset-password call (which re-verifies a fresh OTP
    // there — this branch exists so `/otp/verify` itself doesn't error out
    // if the UI checks the code before asking for a new password).
    return { message: 'OTP verified successfully' };
  }

  async forgotPassword(mobile: string): Promise<{ message: string; otpExpiresIn: number }> {
    const user = await authRepository.findByMobile(mobile);
    if (!user) {
      throw ApiError.notFound('No account found for this mobile number');
    }

    const { otp, expiresIn } = await createAndStoreOtp(mobile, OTPPurpose.FORGOT_PASSWORD);
    await sendOtpSms(mobile, otp, OTPPurpose.FORGOT_PASSWORD);

    return { message: 'OTP sent successfully', otpExpiresIn: expiresIn };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const isValid = await verifyOtp(data.mobile, OTPPurpose.FORGOT_PASSWORD, data.otp);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid or expired OTP');
    }

    const user = await authRepository.findByMobile(data.mobile);
    if (!user) {
      throw ApiError.notFound('No account found for this mobile number');
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await authRepository.updatePassword(user._id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; expiresIn: number; user: AuthUserView }> {
    let payload: { userId: string; role: string };

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const storedToken = await redisClient.get(REDIS_KEYS.refreshToken(payload.userId));

    if (!storedToken || storedToken !== refreshToken) {
      throw ApiError.unauthorized('Refresh token has been revoked or is invalid');
    }

    const user = await authRepository.findByIdWithRefreshToken(payload.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Refresh token has been revoked or is invalid');
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });

    return { accessToken, expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS(), user: toAuthUserView(user) };
  }

  async logout(userId: string): Promise<void> {
    await redisClient.del(REDIS_KEYS.refreshToken(userId));
    await authRepository.setRefreshToken(userId, null);
  }

  async getCurrentUser(userId: string): Promise<AuthUserView> {
    const user = await authRepository.findByIdWithRefreshToken(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return toAuthUserView(user);
  }
}

export const authService = new AuthService();
