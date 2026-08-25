import { MatterClient, type WebSocketLike } from "@matter-server/ws-client";
import { logger } from "./logging";
import delay from "delay";
import { env } from "$env/dynamic/private";
import { building } from "$app/env";

async function createClient() {
  if (!env.WEBSOCKET_URL) {
    logger.error("Undefined env var `WEBSOCKET_URL`");
    throw TypeError("Missing env var");
  }

  const client: MatterClient = new MatterClient(
    env.WEBSOCKET_URL,
    (url: string) => new WebSocket(url) as unknown as WebSocketLike,
  );

  client.addEventListener("connection_lost", async () => {
    logger.warn("Lost connection to the server, trying to reconnect...");
    connectClient(client);
  });

  client.addEventListener("", async () => {});

  await connectClient(client);

  return client;
}

async function connectClient(client: MatterClient) {
  if (!env.WIFI_SSID || !env.WIFI_PASSWORD) {
    logger.error("Undefined env var `WEBSOCKET_URL`");
    throw TypeError("Missing env var");
  }

  if (client.connection.connected) return;

  logger.info("Connecting client to the server...");
  try {
    await client.startListening();
    logger.info("WS client started listening for events...");
  } catch (e) {
    logger.error(`WS client failed to connect: ${e}`);
  }
  await delay(2000);
  logger.debug(`WS client connected: ${client.connection.connected}`);
  let retryCounter = 1;
  while (!client.connection.connected) {
    logger.warn("Could not connect to the server... retrying in 10 seconds");
    await delay(10000);
    logger.info(`Retrying connection (${retryCounter})`);
    retryCounter++;

    try {
      await client.startListening();
      logger.info("WS client started listening for events...");
    } catch (e) {
      logger.error(`WS client failed to connect: ${e}`);
    }
  }
  logger.info("Connection to server established");
  logger.info("Setting up wifi credentials...");
  await client.setWifiCredentials(env.WIFI_SSID, env.WIFI_PASSWORD);
  logger.info("Connection ready!");
}

const client = building ? null : await createClient();
export function getClient() {
  return client!;
}
