import { Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/AuthService";
import { Role } from "../models/enums/role.enum";
import { badRequest } from "../utils/httpError";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  consultationFee: z.number().nonnegative().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export class AuthController {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);
    const out = await authService.register(input);
    res.status(201).json(out);
  }

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const out = await authService.login(email, password);
    res.json(out);
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = refreshSchema.parse(req.body);
    if (!refreshToken) throw badRequest("refreshToken required");
    await authService.logout(refreshToken);
    res.status(204).send();
  }

  async me(req: Request, res: Response) {
    res.json({ user: req.user });
  }
}

export const authController = new AuthController();
