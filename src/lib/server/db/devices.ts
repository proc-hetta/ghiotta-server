import type { APICommands } from "@matter-server/ws-client";

export type DeviceCommand = {
  command: keyof APICommands;
  args: string;
};
