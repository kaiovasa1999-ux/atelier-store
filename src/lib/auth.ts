import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { env } from "@/env";

/**
 * Server-side auth instance — wiring only. No sign-in methods are enabled yet:
 * add `emailAndPassword: { enabled: true }` or `socialProviders: { ... }` when
 * the auth flows get built, then re-run `npm run auth:generate` so the schema
 * matches the enabled features.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // The Neon HTTP driver has no interactive transactions; the adapter runs
    // its writes sequentially instead.
    transaction: false,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  // `nextCookies` must stay last so it can write cookies set by other plugins.
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
