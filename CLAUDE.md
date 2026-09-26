# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Atelier Store is a Next.js 16 e-commerce **scaffold**: plumbing only. No store features, auth flows, schema, UI or payments exist yet. The intended build order (from README) is:

1. `npm run auth:generate`, add `export * from "./auth-schema"` to `src/db/schema.ts`, then `npm run db:generate && npm run db:migrate`.
2. Enable sign-in methods in `src/lib/auth.ts` and build the auth pages.
3. Model the store (products, variants, carts, orders) in `src/db/schema.ts`.
4. Build the UI, then add a payment provider.

Until step 1 is done, `next dev`/`next build` log `ERROR [Better Auth]: Drizzle schema mismatch — Missing tables: user, session, account, verification`. This is expected, not a wiring bug.

## Commands

```bash
npm run dev          # dev server (also rewrites AGENTS.md — see note there)
npm run build
npm run lint         # ESLint (flat config, eslint-config-next)
npm run typecheck    # tsc --noEmit
npm run db:generate  # SQL migrations from schema -> ./drizzle
npm run db:migrate   # apply pending migrations
npm run db:push      # push schema directly (dev only)
npm run db:studio
npm run auth:generate  # Better Auth CLI -> src/db/auth-schema.ts
```

There is no test runner configured yet. Verify changes with `npm run typecheck` and `npm run lint`.

Env: copy `.env.example` to `.env.local`. Requires `DATABASE_URL` (Neon **pooled** string, `-pooler` host, `sslmode=require`) and `BETTER_AUTH_SECRET` (32+ chars). `BETTER_AUTH_URL` defaults to `http://localhost:3000`.

## Architecture

- **Next.js 16 App Router** under `src/app`, path alias `@/*` → `src/*`. This Next version has breaking changes vs. training data — consult `node_modules/next/dist/docs/` before using Next APIs (e.g. layouts use the global `LayoutProps<"/">` type helper).
- **Env access** goes through `src/env.ts`: getters that throw a readable error on missing values at point of use. Server-only; never import from client components. Add new server env vars there rather than reading `process.env` directly.
- **Database**: `src/db/index.ts` exports a single `db` (Drizzle over the Neon **HTTP** driver). HTTP means no interactive transactions — `db.transaction(...)` won't work. If transactions are needed, switch to `drizzle-orm/neon-serverless` + `Pool`. `src/db/schema.ts` is the single schema entry point; split tables into `src/db/schema/*.ts` if desired but re-export from `schema.ts` (drizzle-kit and the `db` client both read that file).
- **drizzle-kit** runs outside Next, so `drizzle.config.ts` loads `.env.local` then `.env` via dotenv itself. Migrations output to `./drizzle`; `strict: true`.
- **Auth (Better Auth)**:
  - `src/lib/auth.ts` — server instance with the Drizzle adapter (`provider: "pg"`, `transaction: false` because of the HTTP driver). No sign-in methods enabled. `nextCookies()` must remain the **last** plugin.
  - `src/app/api/auth/[...all]/route.ts` mounts all endpoints at `/api/auth/*`.
  - `src/lib/auth-client.ts` — browser client (`"use client"`), same-origin, no `baseURL`.
  - Better Auth tables are **generated**, not hand-written: after changing auth config/plugins, re-run `npm run auth:generate`, then generate and apply migrations.
- **Styling**: Tailwind CSS 4 via `@import "tailwindcss"` in `src/app/globals.css` (PostCSS plugin, no `tailwind.config`).
