import { Request, Response } from "express";
import { z } from "zod";
import { patientService } from "../services/PatientService";

const updateSchema = z.object({
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().max(30).optional(),
  bloodGroup: z.string().max(5).optional(),
  emergencyContact: z.string().max(50).optional(),
  address: z.string().max(255).optional()
});

export class PatientController {
  async list(req: Request, res: Response) {
    const q = (req.query.q as string | undefined)?.trim();
    if (q) {
      const { patientRepository } = await import("../repositories/PatientRepository");
      const items = await patientRepository.searchByUserEmail(q);
      res.json({ items });
      return;
    }
    const skip = Number(req.query.skip ?? 0);
    const take = Math.min(Number(req.query.take ?? 50), 100);
    const items = await patientService.list(skip, take);
    res.json({ items, skip, take });
  }

  async getOne(req: Request, res: Response) {
    const p = await patientService.getById(req.params.id);
    res.json(p);
  }

  async me(req: Request, res: Response) {
    const p = await patientService.getByUserId(req.user!.sub);
    res.json(p);
  }

  async update(req: Request, res: Response) {
    const input = updateSchema.parse(req.body);
    const p = await patientService.update(req.params.id, input);
    res.json(p);
  }
}

export const patientController = new PatientController();
