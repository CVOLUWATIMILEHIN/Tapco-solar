import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import fs from "fs";
import * as schema from "./schema.ts";

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export function resolveDbHost(): string | undefined {
  // If Cloud SQL Unix socket directories exist, use the socket directory
  const socketBaseDirs = ["/app/cloudsql", "/cloudsql"];
  for (const baseDir of socketBaseDirs) {
    try {
      if (fs.existsSync(baseDir)) {
        const entries = fs.readdirSync(baseDir);
        for (const entry of entries) {
          const entryPath = `${baseDir}/${entry}`;
          if (fs.existsSync(`${entryPath}/.s.PGSQL.5432`)) {
            console.log(`[Cloud SQL] Detected Unix socket directory: ${entryPath}`);
            return entryPath;
          }
        }
      }
    } catch {
      // Ignore directory scan errors
    }
  }

  let host = process.env.SQL_HOST;
  if (host) {
    if (host.endsWith("/.s.PGSQL.5432")) {
      host = host.replace(/\/\.s\.PGSQL\.5432$/, "");
    }
    return host;
  }

  return "127.0.0.1";
}

export const createPool = () => {
  if (!global._postgresPool) {
    const host = resolveDbHost();
    global._postgresPool = new Pool({
      host,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 10000,
    });

    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
export { schema };
