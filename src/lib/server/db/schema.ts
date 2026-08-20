import { pgTable, serial, boolean, text, uuid, bigint } from "drizzle-orm/pg-core";

export const authorizedDevices = pgTable("authorized_devices", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  admin: boolean().notNull().default(false),
  token: uuid().unique().notNull(),
  enabled: boolean().notNull().default(true),
});

export const smartDevices = pgTable("smart_devices", {
  node_id: bigint("node_id", { mode: "bigint" }).primaryKey(),
  name: text("name").unique().notNull(),
});

export type authorizedDevices = typeof authorizedDevices.$inferSelect;
export type smartDevices = typeof smartDevices.$inferSelect;
