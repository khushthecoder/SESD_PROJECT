import { Request, Response } from "express";
import { z } from "zod";
import { prescriptionService } from "../services/PrescriptionService";

const createSchema = z.object({
  appointmentId: z.string().uuid(),
  items: z
    .array(
      z.object({
        medicine: z.string().min(1),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        durationDays: z.number().int().positive(),
        instructions: z.string().max(500).optional()
      })
    )
    .min(1),
  notes: z.string().max(1000).optional()
});

export class PrescriptionController {
  async create(req: Request, res: Response) {
    const input = createSchema.parse(req.body);
    const rx = await prescriptionService.create(input);
    res.status(201).json(rx);
  }

  async byAppointment(req: Request, res: Response) {
    res.json(await prescriptionService.getForAppointment(req.params.appointmentId));
  }
}

export const prescriptionController = new PrescriptionController();
