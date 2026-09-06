import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.DATABASE_URL.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    const error = new Error('DATABASE_URL is not configured');
    error.code = 'DATABASE_NOT_CONFIGURED';
    throw error;
  }

  return pool.query(text, params);
}

export async function withTransaction(callback) {
  if (!pool) {
    const error = new Error('DATABASE_URL is not configured');
    error.code = 'DATABASE_NOT_CONFIGURED';
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function checkDatabase() {
  if (!pool) {
    return { ready: false, message: 'DATABASE_URL is not configured' };
  }

  try {
    await pool.query('select 1');
    return { ready: true, message: 'connected' };
  } catch (error) {
    return { ready: false, message: error.message };
  }
}
