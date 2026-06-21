import { Pool } from "pg"

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

export const db =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = db
}