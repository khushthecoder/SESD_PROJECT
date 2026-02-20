import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

let client: Redis | null = null;

export async function initRedis(): Promise<Redis | null> {
  if (client) return client;
  try {
    client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false
    });
    await client.connect();
    logger.info("redis connected");
  } catch (err) {
    logger.warn("redis unavailable, continuing without cache", { err: String(err) });
    client = null;
  }
  return client;
}

export function redis(): Redis | null {
  return client;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!client) return null;
  const v = await client.get(key);
  return v ? (JSON.parse(v) as T) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSec: number): Promise<void> {
  if (!client) return;
  await client.set(key, JSON.stringify(value), "EX", ttlSec);
}

export async function cacheDel(key: string): Promise<void> {
  if (!client) return;
  await client.del(key);
}
