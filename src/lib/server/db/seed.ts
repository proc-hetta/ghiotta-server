import postgres from "postgres";
import * as schema from "./schema";
import { exit } from "node:process";
import { drizzle } from "drizzle-orm/postgres-js";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  exit(1);
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

const main = async () => {
  /*
  await db
    .insert(schema.authorizedDevices)
    .values({
    })
    .execute();
  */
};

main().then(() => {
  console.log("Seeding done!");
  exit(0);
});
