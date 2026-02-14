import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, openAPI } from 'better-auth/plugins';
import { db } from '../db';
import * as schema from '../db/auth-schema';

function parseTrustedOrigins(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return origins.length > 0 ? origins : undefined;
}

function normalizeCookieDomain(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}

const trustedOrigins = parseTrustedOrigins(process.env.CORS_ORIGIN);
const cookieDomain = normalizeCookieDomain(process.env.BETTER_AUTH_COOKIE_DOMAIN);

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
  advanced: {
    ...(process.env.NODE_ENV === 'production' ? { useSecureCookies: true } : {}),
    ...(cookieDomain
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: cookieDomain,
          },
        }
      : {}),
  },
  plugins: [admin(), openAPI({ disableDefaultReference: true })],
});
