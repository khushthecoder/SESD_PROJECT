import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "validation_error",
      message: "invalid input",
      details: err.flatten()
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
      details: err.details
    });
  }
  logger.error("unhandled error", { err: String(err), stack: (err as Error)?.stack });
  res.status(500).json({ error: "internal_error", message: "something went wrong" });
};
