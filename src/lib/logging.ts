import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
});
