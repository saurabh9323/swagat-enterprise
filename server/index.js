import { createApp } from './src/app.js';
import { env } from './src/config/env.js';
import { checkDatabase } from './src/db/pool.js';

const app = createApp();

checkDatabase()
  .then((database) => {
    app.locals.databaseReady = database.ready;
    console.log(`PostgreSQL health check: ${database.ready ? 'ready' : 'unavailable'}. ${database.message}`);
    if (!database.ready) {
      console.warn(`PostgreSQL unavailable. API will use demo fallback where supported. ${database.message}`);
    }
  })
  .catch((error) => {
    app.locals.databaseReady = false;
    console.warn('PostgreSQL health check failed. API will use demo fallback where supported.', error.message);
  })
  .finally(() => {
    app.listen(env.PORT, () => {
      console.log(`Swagat Enterprise API running on http://localhost:${env.PORT}/api`);
    });
  });
