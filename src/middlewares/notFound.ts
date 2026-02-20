import { RequestHandler } from "express";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: "not_found", message: `route ${req.method} ${req.path} not found` });
};
