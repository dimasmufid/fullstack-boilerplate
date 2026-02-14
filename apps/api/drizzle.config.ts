import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: resolve(process.cwd(), '../../.env.local') });
dotenv.config();

export default defineConfig({
  out: './drizzle',
  schema: './src/db/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
