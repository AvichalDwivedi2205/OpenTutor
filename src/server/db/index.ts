// src/server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development.
 */
const globalForDb = globalThis as unknown as { conn: postgres.Sql | undefined };

// Heuristic: Supabase transaction pooler uses port 6543 & host *.pooler.supabase.com
const isSupavisorTx =
  env.DATABASE_URL?.includes(":6543") ||
  env.DATABASE_URL?.includes("pooler.supabase.com");

const conn =
  globalForDb.conn ??
  postgres(env.DATABASE_URL, {
    // Required when using Supabase transaction pooler (no prepared statements)
    prepare: isSupavisorTx ? false : undefined,
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
