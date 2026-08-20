import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { authorizedDevices as devices } from "$lib/server/db/schema";

export type AuthorizedDevice = {
  name: string;
  admin: boolean;
  token: string;
  enabled: boolean;
};

export async function getDevice(id: number) {
  return (
    (
      await db
        .select({
          id: devices.id,
          name: devices.name,
          admin: devices.admin,
          token: devices.token,
          enabled: devices.enabled,
        })
        .from(devices)
        .where(eq(devices.id, id))
        .execute()
    )?.at(0) ?? null
  );
}

export async function createDevice(authorizedDevice: AuthorizedDevice) {
  return db.insert(devices).values(authorizedDevice).returning();
}

export async function getDevices() {
  return db
    .select({
      id: devices.id,
      name: devices.name,
      admin: devices.admin,
      token: devices.token,
      enabled: devices.enabled,
    })
    .from(devices)
    .orderBy(devices.id);
}

export async function updateDevice(id: number, authorizedDevice: AuthorizedDevice) {
  return db.update(devices).set(authorizedDevice).where(eq(devices.id, id));
}

export async function deleteDevice(id: number) {
  return db.delete(devices).where(eq(devices.id, id)).returning();
}

export async function getAuthorizedDeviceByToken(token: string) {
  return (
    (
      await db
        .select({
          id: devices.id,
          name: devices.name,
          admin: devices.admin,
          token: devices.token,
          enabled: devices.enabled,
        })
        .from(devices)
        .where(eq(devices.token, token))
        .execute()
    )?.at(0) ?? null
  );
}

export async function getAdminByToken(token: string) {
  const user = await getAuthorizedDeviceByToken(token);
  return user?.admin ? user : null;
}
