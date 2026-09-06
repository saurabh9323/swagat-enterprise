import { z } from 'zod';

const roleSchema = z.enum(['super_admin', 'owner', 'admin', 'staff']);
const mfaMethodSchema = z.enum(['none', 'email_otp', 'sms_otp', 'authenticator']);
const otpChannelSchema = z.enum(['email', 'sms', 'whatsapp']);

export const userQuerySchema = z.object({
  query: z.object({
    role: roleSchema.optional(),
    isActive: z.coerce.boolean().optional(),
    q: z.string().trim().optional(),
  }),
});

export const userParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const userCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    phone: z.string().trim().optional(),
    username: z.string().trim().min(3).optional(),
    alternatePhone: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    branch: z.string().trim().optional(),
    avatarUrl: z.string().url().optional(),
    password: z.string().min(8),
    role: roleSchema.default('staff'),
    permissions: z.record(z.string(), z.unknown()).optional(),
    mfaEnabled: z.boolean().default(false),
    mfaMethod: mfaMethodSchema.default('none'),
    otpChannel: otpChannelSchema.default('email'),
    isActive: z.boolean().default(true),
  }),
});

export const userUpdateSchema = z.object({
  params: userParamsSchema.shape.params,
  body: z.object({
    name: z.string().trim().min(2).optional(),
    phone: z.string().trim().optional(),
    username: z.string().trim().min(3).optional(),
    alternatePhone: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    branch: z.string().trim().optional(),
    avatarUrl: z.string().url().optional(),
    password: z.string().min(8).optional(),
    role: roleSchema.optional(),
    permissions: z.record(z.string(), z.unknown()).optional(),
    mfaEnabled: z.boolean().optional(),
    mfaMethod: mfaMethodSchema.optional(),
    otpChannel: otpChannelSchema.optional(),
    isActive: z.boolean().optional(),
  }).refine((value) => Object.keys(value).length > 0, 'At least one user field is required'),
});
