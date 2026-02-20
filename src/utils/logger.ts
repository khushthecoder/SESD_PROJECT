import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const fmt = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${ts} [${level}] ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === "test" ? "error" : "info",
  format: combine(errors({ stack: true }), timestamp(), colorize(), fmt),
  transports: [new winston.transports.Console()]
});
