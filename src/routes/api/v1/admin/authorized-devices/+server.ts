import { createDevice, getDevices, type AuthorizedDevice } from "$lib/server/db/authorized-devices";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  return json(await getDevices());
};

export const POST: RequestHandler = async ({ request }) => {
  const data: AuthorizedDevice = await request.json();
  return json((await createDevice(data)).at(0));
};
