CREATE TABLE "smart_devices" (
	"node_id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "smart_devices_name_unique" UNIQUE("name")
);
