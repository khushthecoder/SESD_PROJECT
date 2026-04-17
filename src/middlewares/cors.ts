import { Request, Response, NextFunction } from "express";

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"];
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-Request-ID"];

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
  res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};
