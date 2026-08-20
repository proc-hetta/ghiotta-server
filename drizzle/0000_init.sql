CREATE TABLE "authorized_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"token" uuid NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "authorized_devices_name_unique" UNIQUE("name"),
	CONSTRAINT "authorized_devices_token_unique" UNIQUE("token")
);
