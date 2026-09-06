import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { checkDatabase } from './db/pool.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { leadRouter } from './routes/leadRoutes.js';
import { propertyRouter } from './routes/propertyRoutes.js';
import { settingsRouter } from './routes/settingsRoutes.js';
import { userRouter } from './routes/userRoutes.js';

const requiredCorsOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://swagat-enterprise.netlify.app',
];

function corsOrigins() {
  return Array.from(new Set([
    ...requiredCorsOrigins,
    ...env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean),
  ]));
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;

  if (corsOrigins().includes(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'https:' && hostname.endsWith('.netlify.app');
  } catch {
    return false;
  }
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      callback(null, isAllowedCorsOrigin(origin));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', async (request, response) => {
    if (typeof request.app.locals.databaseReady === 'boolean') {
      response.json({
        ok: true,
        database: request.app.locals.databaseReady ? 'postgresql' : 'memory',
        message: request.app.locals.databaseReady ? 'PostgreSQL is ready' : 'Using demo fallback',
      });
      return;
    }

    const database = await checkDatabase();
    response.json({ ok: true, database: database.ready ? 'postgresql' : 'memory', message: database.message });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/properties', propertyRouter);
  app.use('/api/leads', leadRouter);
  app.use('/api/users', userRouter);
  app.use('/api/settings', settingsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
