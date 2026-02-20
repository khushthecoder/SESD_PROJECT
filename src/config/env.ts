import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://healthsync:healthsync@localhost:5432/healthsync"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/healthsync_docs"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().default("dev_jwt_secret"),
  JWT_REFRESH_SECRET: z.string().default("dev_refresh_secret"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  CORS_ORIGIN: z.string().default("http://localhost:3000")
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
