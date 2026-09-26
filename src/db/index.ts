import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { env } from "@/env";

/**
 * Neon over HTTP: one round trip per query and no pool to hold open, which is
 * what serverless request handlers want. The trade-off is no interactive
 * transactions — if you need `db.transaction(...)`, swap this for the WebSocket
 * driver (`drizzle-orm/neon-serverless` + `Pool`).
 */
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
