import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get("User-Agent") || "unknown",
    };

    if (statusCode >= 400) {
      logger.warn("Request failed", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
};
