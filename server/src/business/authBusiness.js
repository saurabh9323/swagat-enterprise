import { createOtpChallenge, createToken, publicUser, verifyCredentials, verifyOtpChallenge } from '../services/authService.js';

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
