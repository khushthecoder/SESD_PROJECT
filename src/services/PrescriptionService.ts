import { prisma } from "../config/prisma";
import { PrescriptionBuilder } from "../patterns/builder/PrescriptionBuilder";
import { badRequest, conflict, notFoundErr } from "../utils/httpError";
import { AppointmentStatus } from "../models/enums/appointment.enum";

export interface PrescriptionItemInput {
  medicine: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface CreatePrescriptionInput {
  appointmentId: string;
  items: PrescriptionItemInput[];
  notes?: string;
}

export class PrescriptionService {
  async create(input: CreatePrescriptionInput) {
    const appt = await prisma.appointment.findUnique({ where: { id: input.appointmentId } });
    if (!appt) throw notFoundErr("appointment not found");
    if (appt.status !== AppointmentStatus.IN_PROGRESS && appt.status !== AppointmentStatus.COMPLETED) {
      throw badRequest("prescription can only be written for in-progress or completed appointments");
    }
    const existing = await prisma.prescription.findUnique({ where: { appointmentId: input.appointmentId } });
    if (existing) throw conflict("prescription already exists for this appointment");

    const builder = new PrescriptionBuilder().forAppointment(input.appointmentId);
    for (const it of input.items) {
      builder.addMedicine(it.medicine, it.dosage, it.frequency, it.durationDays, it.instructions);
    }
    if (input.notes) builder.withNotes(input.notes);
    const domain = builder.build();

    return prisma.prescription.create({
      data: {
        appointmentId: domain.appointmentId,
        notes: domain.notes,
        items: {
          create: domain.items.map((i) => ({
            medicine: i.medicine,
            dosage: i.dosage,
            frequency: i.frequency,
            durationDays: i.durationDays,
            instructions: i.instructions
          }))
        }
      },
      include: { items: true }
    });
  }

  async getForAppointment(appointmentId: string) {
    const rx = await prisma.prescription.findUnique({
      where: { appointmentId },
      include: { items: true }
    });
    if (!rx) throw notFoundErr("prescription not found");
    return rx;
  }
}

export const prescriptionService = new PrescriptionService();
