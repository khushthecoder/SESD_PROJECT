import { IRepository } from "./IRepository";
import prisma from "../config/prisma";

interface ScheduleData {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  status: string;
}

export class ScheduleRepository implements IRepository<ScheduleData> {
  async findById(id: string): Promise<ScheduleData | null> {
    return prisma.schedule.findUnique({ where: { id } });
  }

  async findAll(): Promise<ScheduleData[]> {
    return prisma.schedule.findMany();
  }

  async create(data: Omit<ScheduleData, "id">): Promise<ScheduleData> {
    return prisma.schedule.create({ data });
  }

  async update(id: string, data: Partial<ScheduleData>): Promise<ScheduleData> {
    return prisma.schedule.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.schedule.delete({ where: { id } });
  }

  async findByDoctorId(doctorId: string): Promise<ScheduleData[]> {
    return prisma.schedule.findMany({ where: { doctorId } });
  }

  async findByDayOfWeek(dayOfWeek: string): Promise<ScheduleData[]> {
    return prisma.schedule.findMany({ where: { dayOfWeek } });
  }
}
