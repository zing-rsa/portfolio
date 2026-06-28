import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

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
await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
await client.end();
