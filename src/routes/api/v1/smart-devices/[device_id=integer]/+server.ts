import { logger } from "$lib/logging";
import { getClient } from "$lib/matterjs-client";
import { removeNode } from "$lib/server/db/smart-devices";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const device_id = params.device_id!;
  return json(getClient().nodes[device_id]);
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  if (!locals.authorizedDevice?.admin) {
    return new Response(error(401, "Unauthorized"));
  }

  const device_id = params.device_id!;
  getClient().removeNode(parseInt(device_id));
  await removeNode(BigInt(device_id));

  // return new Response(`Issued node ${device_id} decommissioning\n`, { status: 200 });
  return json({
    status: 200,
    msg: `Issued node ${device_id} decommissioning`,
  });
};
