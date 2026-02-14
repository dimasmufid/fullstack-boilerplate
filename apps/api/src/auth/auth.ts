import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, openAPI } from 'better-auth/plugins';
import { db } from '../db';
import * as schema from '../db/auth-schema';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin(), openAPI({ disableDefaultReference: true })],
});
