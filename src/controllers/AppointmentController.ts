import { Request, Response } from "express";
import { z } from "zod";
import { appointmentService } from "../services/AppointmentService";
import { AppointmentType, AppointmentStatus } from "../models/enums/appointment.enum";
import { Role } from "../models/enums/role.enum";

const bookSchema = z.object({
  doctorId: z.string().uuid(),
  timeSlotId: z.string().uuid(),
  type: z.nativeEnum(AppointmentType),
  reason: z.string().max(500).optional()
});

const transitionSchema = z.object({
  action: z.enum(["confirm", "start", "complete", "cancel"])
});

const rescheduleSchema = z.object({
  newTimeSlotId: z.string().uuid()
});

export class AppointmentController {
  async book(req: Request, res: Response) {
    const input = bookSchema.parse(req.body);
    const out = await appointmentService.book({
      patientUserId: req.user!.sub,
      doctorId: input.doctorId,
      timeSlotId: input.timeSlotId,
      type: input.type,
      reason: input.reason
    });
    res.status(201).json(out);
  }

  async listAll(req: Request, res: Response) {
    const status = req.query.status ? (String(req.query.status) as AppointmentStatus) : undefined;
    const doctorId = req.query.doctorId ? String(req.query.doctorId) : undefined;
    const patientId = req.query.patientId ? String(req.query.patientId) : undefined;
    const items = await appointmentService.listAll({
      status,
      doctorId,
      patientId,
      skip: Number(req.query.skip ?? 0),
      take: Number(req.query.take ?? 50)
    });
    res.json({ items });
  }

  async bookForPatient(req: Request, res: Response) {
    const input = bookSchema.extend({ patientUserId: z.string().uuid() }).parse(req.body);
    const out = await appointmentService.book({
      patientUserId: input.patientUserId,
      doctorId: input.doctorId,
      timeSlotId: input.timeSlotId,
      type: input.type,
      reason: input.reason
    });
    res.status(201).json(out);
  }

  async mine(req: Request, res: Response) {
    const role = req.user!.role === Role.DOCTOR ? "doctor" : "patient";
    const items = await appointmentService.listForUser(req.user!.sub, role);
    res.json({ items });
  }

  async getOne(req: Request, res: Response) {
    res.json(await appointmentService.getById(req.params.id));
  }

  async transition(req: Request, res: Response) {
    const { action } = transitionSchema.parse(req.body);
    const updated = await appointmentService.transition(req.params.id, action);
    res.json(updated);
  }

  async reschedule(req: Request, res: Response) {
    const { newTimeSlotId } = rescheduleSchema.parse(req.body);
    const updated = await appointmentService.reschedule(req.params.id, newTimeSlotId);
    res.json(updated);
  }
}

export const appointmentController = new AppointmentController();
