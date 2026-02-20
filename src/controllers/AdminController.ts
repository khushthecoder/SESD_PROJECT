import { Request, Response } from "express";
import { z } from "zod";
import { adminService } from "../services/AdminService";

const activeSchema = z.object({ active: z.boolean() });

export class AdminController {
  async stats(_req: Request, res: Response) {
    res.json(await adminService.stats());
  }
  async listUsers(req: Request, res: Response) {
    const skip = Number(req.query.skip ?? 0);
    const take = Number(req.query.take ?? 50);
    res.json({ items: await adminService.listUsers(skip, take) });
  }
  async setActive(req: Request, res: Response) {
    const { active } = activeSchema.parse(req.body);
    res.json(await adminService.setUserActive(req.params.id, active));
  }
}

export const adminController = new AdminController();
