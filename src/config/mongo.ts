import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

let connected = false;

export async function initMongo(): Promise<void> {
  if (connected) return;
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    connected = true;
    logger.info("mongo connected");
  } catch (err) {
    logger.warn("mongo unavailable, continuing without audit logs", { err: String(err) });
  }
}

export function isMongoConnected(): boolean {
  return connected;
}
