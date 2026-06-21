/**
 * shared/helpers/password.helper.ts
 * -------------------------------------
 * Thin wrapper around bcrypt so hashing/comparison logic lives in one
 * place and the salt round count always comes from validated env config.
 */

import bcrypt from 'bcryptjs';
import { env } from '../../config/env';

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
