import "dotenv/config";
import http from "http";
import { buildApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { initRedis } from "./config/redis";
import { initMongo } from "./config/mongo";
import { initSocket } from "./config/socket";

async function bootstrap() {
  const app = buildApp();
  const server = http.createServer(app);

  await initRedis();
  await initMongo();
  initSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`HealthSync API listening on :${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.error("fatal boot error", { err });
  process.exit(1);
});
