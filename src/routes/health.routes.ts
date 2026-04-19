import { Router } from "express";
import { healthCheckHandler } from "../config/healthCheck";

const router = Router();

router.get("/", healthCheckHandler);

router.get("/ping", (_req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

export default router;
