import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  config({ path: '.env' });
  config({ path: resolve(process.cwd(), '../../.env') });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL. Set it in your environment or .env.');
}

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);
