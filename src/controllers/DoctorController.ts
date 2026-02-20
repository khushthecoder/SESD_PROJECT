import { Request, Response } from "express";
import { z } from "zod";
import { doctorService } from "../services/DoctorService";
import { scheduleService } from "../services/ScheduleService";

const scheduleSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  slotMinutes: z.number().int().min(5).max(240).optional()
});

const feeSchema = z.object({ consultationFee: z.number().nonnegative() });

export class DoctorController {
  async list(req: Request, res: Response) {
    const spec = (req.query.specialization as string | undefined)?.trim();
    const items = spec
      ? await doctorService.searchBySpecialization(spec)
      : await doctorService.list(Number(req.query.skip ?? 0), Math.min(Number(req.query.take ?? 50), 100));
    res.json({ items });
  }

  async getOne(req: Request, res: Response) {
    res.json(await doctorService.getById(req.params.id));
  }

  async setSchedule(req: Request, res: Response) {
    const input = scheduleSchema.parse(req.body);
    const schedule = await scheduleService.setWeeklySchedule(req.params.id, input);
    res.status(201).json(schedule);
  }

  async availableSlots(req: Request, res: Response) {
    const date = String(req.query.date ?? "");
    const slots = await scheduleService.getAvailableSlots(req.params.id, date);
    res.json({ slots });
  }

  async updateFee(req: Request, res: Response) {
    const { consultationFee } = feeSchema.parse(req.body);
    const d = await doctorService.updateFee(req.params.id, consultationFee);
    res.json(d);
  }
}

export const doctorController = new DoctorController();
