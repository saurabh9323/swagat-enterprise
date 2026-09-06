import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const loginOtpSchema = z.object({
  body: z.object({
    otpId: z.string().uuid(),
    otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  }),
});

export const otpRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).optional(),
  }),
});
