import {
  getDevice,
  deleteDevice,
  updateDevice,
  type AuthorizedDevice,
} from "$lib/server/db/authorized-devices";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id!;
  return json(await getDevice(parseInt(id)));
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params.id!;
  const data: AuthorizedDevice = await request.json();
  return json(await updateDevice(parseInt(id), data));
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id!;
  return json((await deleteDevice(parseInt(id))).at(0));
};
