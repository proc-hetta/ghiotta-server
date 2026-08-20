import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({}) => {
  return json({
    segreto: "Vittorio è il più bello del mondo!",
  });
};
