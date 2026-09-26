/**
 * Drizzle schema — intentionally empty in this scaffold.
 *
 * Add tables here, or split them into `src/db/schema/*.ts` and re-export from
 * this file so `db` stays the single entry point:
 *
 *   import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
 *
 *   export const product = pgTable("product", {
 *     id: uuid("id").primaryKey().defaultRandom(),
 *     name: text("name").notNull(),
 *     createdAt: timestamp("created_at").notNull().defaultNow(),
 *   });
 *
 * Better Auth's own tables (user / session / account / verification) are
 * generated rather than hand-written — run `npm run auth:generate`, then
 * re-export the result from here:
 *
 *   export * from "./auth-schema";
 */

export {};
