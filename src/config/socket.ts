import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { env } from "./env";
import { logger } from "../utils/logger";

let io: IOServer | null = null;

export function initSocket(server: HttpServer): IOServer {
  io = new IOServer(server, {
    cors: { origin: env.CORS_ORIGIN, credentials: true }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId as string | undefined;
    if (userId) socket.join(`user:${userId}`);
    logger.info("socket connected", { id: socket.id, userId });
    socket.on("disconnect", () => logger.info("socket disconnected", { id: socket.id }));
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown): void {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
