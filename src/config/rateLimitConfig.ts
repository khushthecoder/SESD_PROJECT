import rateLimit from "express-rate-limit";

const presets = {
  auth: { windowMs: 15 * 60 * 1000, max: 10, message: "Too many login attempts, try again after 15 minutes" },
  api: { windowMs: 60 * 1000, max: 100, message: "Too many requests, please slow down" },
  upload: { windowMs: 60 * 60 * 1000, max: 20, message: "Upload limit reached, try again later" },
  report: { windowMs: 60 * 1000, max: 10, message: "Report generation rate limited" },
};

export function createRateLimiter(preset: keyof typeof presets) {
  const config = presets[preset];
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { success: false, message: config.message },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export const authLimiter = createRateLimiter("auth");
export const apiLimiter = createRateLimiter("api");
export const uploadLimiter = createRateLimiter("upload");
export const reportLimiter = createRateLimiter("report");
