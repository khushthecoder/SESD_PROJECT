import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

class PrismaSingleton {
  private static instance: PrismaClient;

  static get client(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: [{ emit: "event", level: "error" }]
      });
      (PrismaSingleton.instance as any).$on("error", (e: unknown) =>
        logger.error("prisma error", { e })
      );
    }
    return PrismaSingleton.instance;
  }
}

export const prisma = PrismaSingleton.client;
