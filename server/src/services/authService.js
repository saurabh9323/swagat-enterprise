import bcrypt from 'bcryptjs';
import { randomInt, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { toCamelUser } from '../utils/normalize.js';

export async function getUserForLogin(email) {
  const result = await query('select * from get_user_for_login($1)', [email.toLowerCase()]);
  return result.rows[0] || null;
}

export async function verifyCredentials(email, password) {
  const user = await getUserForLogin(email);
  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return user;
}

export function createToken(user) {
  const tokenId = randomUUID();

  return jwt.sign(
    {
      jti: tokenId,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    mfaEnabled: user.mfa_enabled ?? user.mfaEnabled ?? false,
    mfaMethod: user.mfa_method ?? user.mfaMethod ?? 'none',
    otpChannel: user.otp_channel ?? user.otpChannel ?? 'email',
  };
}

export async function createOtpChallenge(user, request, purpose = 'login_mfa') {
  const otp = String(randomInt(100000, 1000000));
  const otpHash = await bcrypt.hash(otp, 12);
  const destination = user.otp_channel === 'sms' ? user.phone : user.email;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const result = await query(
    'select * from create_user_otp($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      user.id,
      purpose,
      user.otp_channel || 'email',
      destination,
      otpHash,
      expiresAt,
      request?.ip || null,
      request?.headers?.['user-agent'] || null,
    ]
  );

  return {
    otpId: result.rows[0].id,
    channel: result.rows[0].channel,
    destination: result.rows[0].destination,
    expiresAt: result.rows[0].expires_at,
    devOtp: env.NODE_ENV === 'production' ? undefined : otp,
  };
}

export async function verifyOtpChallenge(otpId, otp) {
  const challengeResult = await query('select * from get_user_otp_challenge($1)', [otpId]);
  const challenge = challengeResult.rows[0];

  if (!challenge || challenge.consumed_at) {
    throw new ApiError(401, 'Invalid or expired OTP');
  }

  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    throw new ApiError(401, 'OTP expired');
  }

  if (challenge.failed_attempts >= challenge.max_attempts) {
    throw new ApiError(429, 'Too many OTP attempts');
  }

  const matches = await bcrypt.compare(otp, challenge.otp_hash);
  if (!matches) {
    await query('select * from increment_user_otp_failure($1)', [otpId]);
    throw new ApiError(401, 'Invalid OTP');
  }

  await query('select * from consume_user_otp($1)', [otpId]);
  const userResult = await query('select * from get_user_by_id($1)', [challenge.user_id]);
  const user = userResult.rows[0];

  if (!user || !user.is_active) {
    throw new ApiError(401, 'User is not active');
  }

  return toCamelUser(user);
}
