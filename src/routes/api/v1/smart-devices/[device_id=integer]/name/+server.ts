import { getNode, updateNode, type smartDevice } from "$lib/server/db/smart-devices";
import { toBigIntAwareJson } from "@matter-server/ws-client";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const device_id = params.device_id!;
  return new Response(toBigIntAwareJson(await getNode(BigInt(device_id))), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const device_id = params.device_id!;
  const data = await request.json();

  const update_node: smartDevice = {
    node_id: BigInt(device_id),
    name: data.new_name,
  };

  return json(await updateNode(update_node));
};
