import { prisma } from "../config/prisma";
import { AppointmentStatus, AppointmentType } from "../models/enums/appointment.enum";
import { IRepository } from "./IRepository";

export interface AppointmentRow {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string | null;
  fee: unknown;
}

export interface IAppointmentRepository extends IRepository<AppointmentRow> {
  findByPatient(patientId: string): Promise<AppointmentRow[]>;
  findByDoctor(doctorId: string): Promise<AppointmentRow[]>;
  updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentRow>;
}

export class AppointmentRepository implements IAppointmentRepository {
  async findById(id: string): Promise<AppointmentRow | null> {
    return prisma.appointment.findUnique({ where: { id } }) as unknown as Promise<AppointmentRow | null>;
  }

  async findAll(opts: { skip?: number; take?: number } = {}): Promise<AppointmentRow[]> {
    return prisma.appointment.findMany({
      skip: opts.skip ?? 0,
      take: opts.take ?? 50,
      orderBy: { createdAt: "desc" }
    }) as unknown as Promise<AppointmentRow[]>;
  }

  async findByPatient(patientId: string): Promise<AppointmentRow[]> {
    return prisma.appointment.findMany({
      where: { patientId },
      include: { timeSlot: true, doctor: { include: { user: true } } },
      orderBy: { createdAt: "desc" }
    }) as unknown as Promise<AppointmentRow[]>;
  }

  async findByDoctor(doctorId: string): Promise<AppointmentRow[]> {
    return prisma.appointment.findMany({
      where: { doctorId },
      include: { timeSlot: true, patient: { include: { user: true } } },
      orderBy: { createdAt: "desc" }
    }) as unknown as Promise<AppointmentRow[]>;
  }

  async create(data: Partial<AppointmentRow>): Promise<AppointmentRow> {
    if (!data.patientId || !data.doctorId || !data.timeSlotId || !data.type || data.fee === undefined) {
      throw new Error("missing required fields");
    }
    return prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        timeSlotId: data.timeSlotId,
        type: data.type,
        status: data.status ?? AppointmentStatus.SCHEDULED,
        reason: data.reason ?? undefined,
        fee: data.fee as number
      }
    }) as unknown as AppointmentRow;
  }

  async update(id: string, data: Partial<AppointmentRow>): Promise<AppointmentRow> {
    return prisma.appointment.update({
      where: { id },
      data: {
        status: data.status ?? undefined,
        reason: data.reason ?? undefined
      }
    }) as unknown as AppointmentRow;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentRow> {
    return prisma.appointment.update({ where: { id }, data: { status } }) as unknown as AppointmentRow;
  }

  async delete(id: string): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }
}

export const appointmentRepository = new AppointmentRepository();
