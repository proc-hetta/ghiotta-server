import { getClient } from "$lib/matterjs-client";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params, request }) => {
  const device_id = params.device_id!;
  const data = await request.json();

  const colorX = Math.round(data.colorX * 65279);
  const colorY = Math.round(data.colorY * 65279);

  const args = {
    node_id: parseInt(device_id),
    endpoint_id: 1,
    cluster_id: 768,
    command_name: "moveToColor",
    payload: {
      colorX,
      colorY,
      transitionTime: 20,
      optionsMask: 0,
      optionsOverride: 0,
    },
    response_type: undefined,
  };

  await getClient().sendCommand("device_command", getClient().serverInfo.schema_version, args);
  return new Response(null, { status: 200 });
};
