import { Request, Response } from "express";
import prisma from "./prisma";
import { logger } from "../utils/logger";

interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  services: { database: { status: string; responseTimeMs?: number }; memory: { heapUsedMB: number; heapTotalMB: number; rssMB: number } };
  version: string;
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const dbStatus = await checkDatabase();
  const memUsage = process.memoryUsage();
  return {
    status: dbStatus.status === "down" ? "unhealthy" : "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      memory: {
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
      },
    },
    version: process.env.APP_VERSION || "1.0.0",
  };
}

async function checkDatabase() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "up", responseTimeMs: Date.now() - start };
  } catch (err) {
    logger.error("Database health check failed", err);
    return { status: "down" };
  }
}

export const healthCheckHandler = async (_req: Request, res: Response) => {
  const health = await getHealthStatus();
  res.status(health.status === "healthy" ? 200 : 503).json(health);
};
