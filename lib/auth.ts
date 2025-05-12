// lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/database/db';
import * as schema from '@/database/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: {
      // Explicitly map the schema tables
      users: schema.users,
      accounts: schema.accounts,
      sessions: schema.sessions,
      verifications: schema.verifications,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [nextCookies()],
});
