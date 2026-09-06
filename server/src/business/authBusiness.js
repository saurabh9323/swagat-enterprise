import { ApiError } from '../utils/ApiError.js';
import { createOtpChallenge, createToken, getUserForLogin, publicUser, verifyCredentials, verifyOtpChallenge } from '../services/authService.js';

export async function login({ email, password }, request) {
  const user = await verifyCredentials(email, password);

  if (user.mfa_enabled) {
    const challenge = await createOtpChallenge(user, request);
    return {
      mfaRequired: true,
      challenge,
      user: publicUser(user),
    };
  }

  const token = createToken(user);

  return {
    token,
    user: publicUser(user),
  };
}

export function currentUser(user) {
  return { user };
}

export async function verifyLoginOtp({ otpId, otp }) {
  const user = await verifyOtpChallenge(otpId, otp);
  const token = createToken(user);

  return {
    token,
    user,
  };
}

export async function requestPasswordlessOtp({ email, password }, request) {
  const user = password
    ? await verifyCredentials(email, password)
    : await getUserForLogin(email);

  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid email');
  }

  if (user.mfa_enabled && !password) {
    throw new ApiError(401, 'Password is required before OTP for MFA-enabled accounts');
  }

  const challenge = await createOtpChallenge(user, request, user.mfa_enabled ? 'login_mfa' : 'passwordless_login');
  return {
    otpRequired: true,
    passwordRequired: Boolean(user.mfa_enabled),
    challenge,
    user: publicUser(user),
  };
}
