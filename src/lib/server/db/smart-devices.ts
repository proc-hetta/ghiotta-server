import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { smartDevices as devices } from "$lib/server/db/schema";

export type smartDevice = {
  node_id: bigint;
  name: string;
};

export async function getNode(node_id: bigint) {
  return (
    (
      await db
        .select({
          node_id: devices.node_id,
          name: devices.name,
        })
        .from(devices)
        .where(eq(devices.node_id, node_id))
        .execute()
    )?.at(0) ?? null
  );
}

export async function getNodes() {
  return db
    .select({
      node_id: devices.node_id,
      name: devices.name,
    })
    .from(devices)
    .orderBy(devices.node_id);
}

export async function createNode(smartDevice: smartDevice) {
  return db.insert(devices).values(smartDevice).returning();
}

export async function updateNode(smartDevice: smartDevice) {
  return db.update(devices).set(smartDevice).where(eq(devices.node_id, smartDevice.node_id));
}

export async function removeNode(node_id: bigint) {
  return db.delete(devices).where(eq(devices.node_id, node_id));
}
