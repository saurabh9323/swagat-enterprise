import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db/pool.js';

if (!pool) {
  console.error('DATABASE_URL is required to run migrations.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '..', 'migrations');
const files = (await fs.readdir(migrationsDir))
  .filter((file) => file.endsWith('.sql'))
  .sort();

for (const file of files) {
  const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
  console.log(`Running ${file}`);
  await pool.query(sql);
}

await pool.end();
console.log('Migrations complete.');
