import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { log } from "@/lib/log";

/**
 * Reuse a single postgres.js client across hot reloads in dev and across
 * requests in production. `max: 1` keeps the pool small — fine for a portfolio
 * site and friendly to per-pod connection limits in Kubernetes.
 */
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

/**
 * Lazily create the client on first use rather than at import time. The app is
 * force-dynamic, so DATABASE_URL is only needed when a request actually queries
 * — not during `next build`, which imports this module to analyze routes.
 */
function getClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  let client = globalForDb.client;
  if (!client) {
    client = postgres(connectionString, { max: 1 });
    log.debug("db client created", { max: 1 });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.client = client;
    }
  }
  return client;
}

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    dbInstance ??= drizzle(getClient(), { schema });
    return Reflect.get(dbInstance, prop, receiver);
  },
});

export { schema };
