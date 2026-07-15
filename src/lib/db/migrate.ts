import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { log } from "../log";

/**
 * Standalone migrator. Applies the SQL files in ./drizzle against DATABASE_URL
 * then exits — run as the `migrate` initContainer before the app starts, not
 * imported by the app. Bundled at build time (see Dockerfile) so it can run in
 * the slim runtime image without drizzle-kit or the dev node_modules.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { max: 1 });
log.info("migrations starting");
try {
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  log.info("migrations applied");
} catch (err) {
  log.error("migrations failed", {
    error: err instanceof Error ? err.message : String(err),
  });
  throw err;
} finally {
  await client.end();
}
