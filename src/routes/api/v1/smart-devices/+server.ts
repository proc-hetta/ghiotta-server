import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getClient } from "$lib/matterjs-client";
import { toBigIntAwareJson, parseBigIntAwareJson } from "@matter-server/ws-client";
import { createNode, getNode } from "$lib/server/db/smart-devices";

export const GET: RequestHandler = async () => {
  return new Response(
    toBigIntAwareJson({
      server_info: getClient().serverInfo,
      connected_nodes: await Promise.all(
        Object.values(getClient().nodes).map(async (node) => {
          return { name: (await getNode(BigInt(node.node_id)))?.name ?? "Unknown", ...node };
        }),
      ),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.authorizedDevice?.admin) {
    return new Response(error(401, "Unauthorized"));
  }

  const commissionArgs: {
    code: string;
    network_only?: boolean;
    name?: string;
  } = await request.json();

  const commissionOpts: {
    threadDatasetId?: string;
    timeout?: number;
    wifiCredentialsId?: string;
  } = { timeout: 100000 };

  const code = commissionArgs.code;
  const network_only = commissionArgs.network_only ?? true;
  const name = commissionArgs.name ?? "Unknown";

  // Commissioning new device and registering its name
  const commissionedNode = await getClient().commissionWithCode(code, network_only, commissionOpts);
  const smartNodeDevice = {
    node_id: BigInt(commissionedNode.node_id),
    name,
  };
  await createNode(smartNodeDevice);

  return json({ ...commissionedNode, ...{ name: smartNodeDevice.name } });
};
