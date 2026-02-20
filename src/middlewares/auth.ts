import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt";
import { forbidden, unauthorized } from "../utils/httpError";
import { Role } from "../models/enums/role.enum";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(unauthorized("missing bearer token"));
  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(unauthorized("invalid or expired token"));
  }
}

export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!allowed.includes(req.user.role)) return next(forbidden("insufficient role"));
    next();
  };
}
