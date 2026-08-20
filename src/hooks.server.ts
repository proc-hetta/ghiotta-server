import { error, type Handle } from "@sveltejs/kit";
import { logger } from "$lib/logging";
import {
  getAdminByToken,
  getAuthorizedDeviceByToken,
  type AuthorizedDevice,
} from "$lib/server/db/authorized-devices";

export const handle: Handle = async ({ event, resolve }) => {
  const authorization = event.request.headers
    .get("Authorization")
    ?.trim()
    .toLocaleLowerCase()
    .split(/\s+/);
  const token = authorization?.at(1) ?? "";

  // Source - https://stackoverflow.com/a/13653180
  // Posted by Gambol, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-08-19, License - CC BY-SA 4.0
  const uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (authorization && (authorization.length != 2 || authorization[0] != "bearer")) {
    logger.warn(`Malformed header (${authorization})`);
    return new Response(error(400, "Bad request"));
  }

  if (token.match(uuid_regex) === null) {
    logger.warn(`Malformed token (${token})`);
    return new Response(error(401, "Unauthorized"));
  }

  const authorizedDevice: AuthorizedDevice | null = await getAuthorizedDeviceByToken(token);

  if (event.url.pathname.startsWith("/api/v1/self") && !authorizedDevice?.enabled) {
    logger.warn(`Access with unregistered token ${token} (IP: ${event.getClientAddress()})`);
    return new Response(error(401, "Unauthorized"));
  }
  if (event.url.pathname.startsWith("/api/v1/admin") && !authorizedDevice?.enabled) {
    logger.warn(
      `Unauthorized access attempt to admin routes using token ${token} (IP: ${event.getClientAddress()})`,
    );
    return new Response(error(401, "Unauthorized"));
  }
  if (event.url.pathname.startsWith("/api/v1/smart-devices") && !authorizedDevice?.enabled) {
    logger.warn(
      `Unauthorized access attempt to smart-devices routes using token ${token} (IP: ${event.getClientAddress()})`,
    );
    return new Response(error(401, "Unauthorized"));
  }
  logger.debug(
    `Accepted request to access ${event.request.method} ${event.request.url} using token ${token} (IP: ${event.getClientAddress()})`,
  );

  event.locals.authorizedDevice = authorizedDevice;

  return resolve(event);
};
