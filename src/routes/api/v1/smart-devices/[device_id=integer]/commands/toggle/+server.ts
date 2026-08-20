import { getClient } from "$lib/matterjs-client";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params }) => {
  const device_id = params.device_id!;

  const args = {
    node_id: parseInt(device_id),
    endpoint_id: 1,
    cluster_id: 6,
    command_name: "toggle",
    payload: undefined,
    response_type: undefined,
  };

  await getClient().sendCommand("device_command", getClient().serverInfo.schema_version, args);
  return new Response(null, { status: 200 });
};
