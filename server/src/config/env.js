import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['DATABASE_URL', 'JWT_SECRET'];

requiredInProduction.forEach((key) => {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`${key} is required in production`);
  }
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'development-only-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173',
};

export const isProduction = env.NODE_ENV === 'production';
