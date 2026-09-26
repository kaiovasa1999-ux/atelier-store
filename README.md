# Atelier Store

Scaffold for a Next.js e-commerce app. Everything here is plumbing — no store
features, auth flows, schema, UI or payments yet.

## Stack

| Concern    | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, `src/`, TypeScript)               |
| Styling    | Tailwind CSS 4 (`@import "tailwindcss"` in `globals.css`) |
| Database   | Postgres on Neon, via the `@neondatabase/serverless` HTTP driver |
| ORM        | Drizzle ORM + drizzle-kit                                 |
| Auth       | Better Auth, Drizzle adapter, mounted at `/api/auth/*`    |
| Linting    | ESLint (`eslint-config-next`)                             |

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Neon project and copy the **pooled** connection string.

3. Create your env file and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   `BETTER_AUTH_SECRET` needs 32+ random chars:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

## Layout

```
src/
  app/
    api/auth/[...all]/route.ts  Better Auth request handler
    layout.tsx                  root layout
    page.tsx                    placeholder page
    globals.css                 Tailwind entry
  db/
    index.ts                    drizzle client bound to the Neon driver
    schema.ts                   empty — tables go here
  lib/
    auth.ts                     server auth instance (no providers enabled)
    auth-client.ts              browser auth client
  env.ts                        checked access to server env vars
drizzle.config.ts               drizzle-kit config (migrations -> ./drizzle)
```

## Scripts

| Script                 | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Dev server                                                |
| `npm run build`        | Production build                                          |
| `npm run start`        | Serve the production build                                |
| `npm run lint`         | ESLint                                                    |
| `npm run typecheck`    | `tsc --noEmit`                                            |
| `npm run db:generate`  | Generate SQL migrations from the schema into `./drizzle`   |
| `npm run db:migrate`   | Apply pending migrations                                  |
| `npm run db:push`      | Push the schema straight to the database (dev only)       |
| `npm run db:studio`    | Drizzle Studio                                            |
| `npm run auth:generate`| Generate Better Auth's tables into `src/db/auth-schema.ts` |

## Next steps

Roughly in order, each of these is deliberately left undone:

1. `npm run auth:generate`, re-export `./auth-schema` from `src/db/schema.ts`,
   then `npm run db:generate && npm run db:migrate`.
2. Enable sign-in methods in `src/lib/auth.ts` and build the auth pages.
3. Model the store (products, variants, carts, orders) in `src/db/schema.ts`.
4. Build the UI, then add a payment provider.

## Expected warning

Until the auth tables exist, `next build` and `next dev` log:

```
ERROR [Better Auth]: Drizzle schema mismatch
  Missing tables: user, session, account, verification
```

That is the adapter reporting an empty schema, not a broken wiring — step 1 of
*Next steps* clears it.
