import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDb, createMigrationClient } from "./client";

config({ path: "../../.env" });
config({ path: "../../.env.example" });

const databaseUrl = process.env.DATABASE_URL ?? "postgres://lumera:lumera@localhost:5433/lumera";
const client = createMigrationClient(databaseUrl);
const db = createDb(databaseUrl);

await migrate(db, { migrationsFolder: "drizzle" });
await client.end();

console.log("Database migrations completed.");
