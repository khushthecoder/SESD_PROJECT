import { prisma } from "../config/prisma";
import { AppointmentStatus, AppointmentType } from "../models/enums/appointment.enum";
import { appointmentRepository } from "../repositories/AppointmentRepository";
import { AppointmentFactory } from "../patterns/factory/AppointmentFactory";
import { stateFor } from "../patterns/state/states";
import { AppointmentSubject } from "../patterns/observer/AppointmentSubject";
import { badRequest, conflict, notFoundErr } from "../utils/httpError";
import { cacheDel } from "../config/redis";

export type StateAction = "confirm" | "start" | "complete" | "cancel";

export interface BookInput {
  patientUserId: string;
  doctorId: string;
  timeSlotId: string;
  type: AppointmentType;
  reason?: string;
}

export class AppointmentService {
  async book(input: BookInput) {
    const patient = await prisma.patient.findUnique({ where: { userId: input.patientUserId } });
    if (!patient) throw notFoundErr("patient profile not found");

    const doctor = await prisma.doctor.findUnique({ where: { id: input.doctorId } });
    if (!doctor) throw notFoundErr("doctor not found");

    const slot = await prisma.timeSlot.findUnique({ where: { id: input.timeSlotId } });
    if (!slot) throw notFoundErr("time slot not found");
    if (slot.doctorId !== input.doctorId) throw badRequest("slot does not belong to doctor");
    if (slot.booked) throw conflict("time slot already booked");

    const baseFee = Number(doctor.consultationFee);
    const domain = AppointmentFactory.create(input.type, {
      id: "pending",
      patientId: patient.id,
      doctorId: input.doctorId,
      timeSlotId: input.timeSlotId,
      baseFee,
      reason: input.reason
    });
    const finalFee = domain.calculateFee();

    const created = await prisma.$transaction(async (tx) => {
      const existingByslot = await tx.appointment.findUnique({ where: { timeSlotId: input.timeSlotId } });
      if (existingByslot) throw conflict("time slot already booked");
      await tx.timeSlot.update({ where: { id: input.timeSlotId }, data: { booked: true } });
      return tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: input.doctorId,
          timeSlotId: input.timeSlotId,
          type: input.type,
          status: AppointmentStatus.SCHEDULED,
          reason: input.reason,
          fee: finalFee
        }
      });
    });

    const slotDate = slot.startsAt.toISOString().slice(0, 10);
    await cacheDel(`slots:${input.doctorId}:${slotDate}`);

    return created;
  }

  async transition(appointmentId: string, action: StateAction) {
    const appt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      }
    });
    if (!appt) throw notFoundErr("appointment not found");

    const state = stateFor(appt.status as AppointmentStatus);

    const tempDomain = AppointmentFactory.create(appt.type as AppointmentType, {
      id: appt.id,
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      timeSlotId: appt.timeSlotId,
      baseFee: Number(appt.fee),
      status: appt.status as AppointmentStatus,
      reason: appt.reason
    });

    let nextState;
    try {
      nextState = state[action](tempDomain);
    } catch (err) {
      throw badRequest((err as Error).message);
    }

    const updated = await appointmentRepository.updateStatus(appt.id, nextState.name);

    if (action === "cancel") {
      await prisma.timeSlot.update({ where: { id: appt.timeSlotId }, data: { booked: false } });
    }

    await AppointmentSubject.instance().notify({
      appointmentId: appt.id,
      patientUserId: appt.patient.userId,
      doctorUserId: appt.doctor.userId,
      from: appt.status as AppointmentStatus,
      to: nextState.name,
      at: new Date()
    });

    return updated;
  }

  async reschedule(appointmentId: string, newTimeSlotId: string) {
    const appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw notFoundErr("appointment not found");
    if (appt.status !== AppointmentStatus.SCHEDULED && appt.status !== AppointmentStatus.CONFIRMED) {
      throw badRequest("cannot reschedule in current state");
    }
    const newSlot = await prisma.timeSlot.findUnique({ where: { id: newTimeSlotId } });
    if (!newSlot) throw notFoundErr("new time slot not found");
    if (newSlot.doctorId !== appt.doctorId) throw badRequest("new slot must be for same doctor");
    if (newSlot.booked) throw conflict("new time slot already booked");

    return prisma.$transaction(async (tx) => {
      await tx.timeSlot.update({ where: { id: appt.timeSlotId }, data: { booked: false } });
      await tx.timeSlot.update({ where: { id: newTimeSlotId }, data: { booked: true } });
      return tx.appointment.update({
        where: { id: appt.id },
        data: { timeSlotId: newTimeSlotId, status: AppointmentStatus.SCHEDULED }
      });
    });
  }

  async listForUser(userId: string, role: "patient" | "doctor") {
    if (role === "patient") {
      const p = await prisma.patient.findUnique({ where: { userId } });
      if (!p) return [];
      return appointmentRepository.findByPatient(p.id);
    }
    const d = await prisma.doctor.findUnique({ where: { userId } });
    if (!d) return [];
    return appointmentRepository.findByDoctor(d.id);
  }

  async listAll(opts: { status?: AppointmentStatus; doctorId?: string; patientId?: string; skip?: number; take?: number } = {}) {
    return prisma.appointment.findMany({
      where: {
        status: opts.status ?? undefined,
        doctorId: opts.doctorId ?? undefined,
        patientId: opts.patientId ?? undefined
      },
      skip: opts.skip ?? 0,
      take: Math.min(opts.take ?? 50, 200),
      orderBy: { createdAt: "desc" },
      include: {
        timeSlot: true,
        patient: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        doctor: { include: { user: { select: { firstName: true, lastName: true } } } }
      }
    });
  }

  async getById(id: string) {
    const a = await prisma.appointment.findUnique({
      where: { id },
      include: { timeSlot: true, patient: { include: { user: true } }, doctor: { include: { user: true } } }
    });
    if (!a) throw notFoundErr("appointment not found");
    return a;
  }
}

export const appointmentService = new AppointmentService();
