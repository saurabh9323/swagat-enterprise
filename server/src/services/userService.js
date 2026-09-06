import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { toCamelUser } from '../utils/normalize.js';

function buildUserPayload(payload, actorUserId) {
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    username: payload.username || null,
    alternate_phone: payload.alternatePhone || null,
    job_title: payload.jobTitle || null,
    branch: payload.branch || 'Nalasopara East',
    avatar_url: payload.avatarUrl || null,
    role: payload.role || 'staff',
    permissions: payload.permissions || {},
    mfa_enabled: payload.mfaEnabled ?? false,
    mfa_method: payload.mfaMethod || 'none',
    otp_channel: payload.otpChannel || 'email',
    is_active: payload.isActive ?? true,
    invited_by: actorUserId || null,
  };
}

export async function createUser(payload, actorUserId) {
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const result = await query('select * from create_user($1::jsonb)', [
    JSON.stringify({
      ...buildUserPayload(payload, actorUserId),
      password_hash: passwordHash,
    }),
  ]);
  return toCamelUser(result.rows[0]);
}

export async function getUsers(filters = {}) {
  const result = await query('select * from get_users($1, $2, $3)', [
    filters.role || null,
    filters.isActive ?? null,
    filters.q || null,
  ]);
  return result.rows.map(toCamelUser);
}

export async function getUserById(id) {
  const result = await query('select * from get_user_by_id($1)', [id]);
  return toCamelUser(result.rows[0]);
}

export async function updateUser(id, payload) {
  const normalized = {
    name: payload.name,
    phone: payload.phone,
    username: payload.username,
    alternate_phone: payload.alternatePhone,
    job_title: payload.jobTitle,
    branch: payload.branch,
    avatar_url: payload.avatarUrl,
    role: payload.role,
    permissions: payload.permissions,
    mfa_enabled: payload.mfaEnabled,
    mfa_method: payload.mfaMethod,
    otp_channel: payload.otpChannel,
    is_active: payload.isActive,
  };

  if (payload.password) {
    normalized.password_hash = await bcrypt.hash(payload.password, 12);
  }

  const result = await query('select * from update_user($1, $2::jsonb)', [id, JSON.stringify(normalized)]);
  return toCamelUser(result.rows[0]);
}

export async function deactivateUser(id) {
  const result = await query('select * from deactivate_user($1)', [id]);
  return toCamelUser(result.rows[0]);
}
