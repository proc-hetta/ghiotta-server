import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { building } from "$app/environment";

// Kick-start database
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

// Migrate Drizzle
if (!building) await migrate(db, { migrationsFolder: "drizzle" });
