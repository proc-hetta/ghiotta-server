export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      LOG_LEVEL: "erro" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
      WEBSOCKET_URL: string;
      WIFI_SSID: string;
      WIFI_PASSWORD: string;
      ORIGIN: string;
    }
  }
}
