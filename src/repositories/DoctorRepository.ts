import { prisma } from "../config/prisma";
import { IRepository } from "./IRepository";

export interface DoctorRow {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  consultationFee: unknown;
  yearsOfExperience: number;
}

export class DoctorRepository implements IRepository<DoctorRow> {
  async findById(id: string): Promise<DoctorRow | null> {
    return prisma.doctor.findUnique({ where: { id } }) as Promise<DoctorRow | null>;
  }

  async findByUserId(userId: string): Promise<DoctorRow | null> {
    return prisma.doctor.findUnique({ where: { userId } }) as Promise<DoctorRow | null>;
  }

  async findAll(opts: { skip?: number; take?: number } = {}): Promise<DoctorRow[]> {
    return prisma.doctor.findMany({
      skip: opts.skip ?? 0,
      take: opts.take ?? 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true } } }
    }) as unknown as Promise<DoctorRow[]>;
  }

  async findBySpecialization(specialization: string): Promise<DoctorRow[]> {
    return prisma.doctor.findMany({
      where: { specialization: { contains: specialization, mode: "insensitive" } },
      include: { user: { select: { firstName: true, lastName: true, email: true } } }
    }) as unknown as Promise<DoctorRow[]>;
  }

  async create(data: Partial<DoctorRow>): Promise<DoctorRow> {
    if (!data.userId || !data.licenseNumber || !data.specialization) {
      throw new Error("userId, licenseNumber, and specialization required");
    }
    return prisma.doctor.create({
      data: {
        userId: data.userId,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
        consultationFee: (data.consultationFee as number) ?? 500,
        yearsOfExperience: data.yearsOfExperience ?? 0
      }
    }) as unknown as DoctorRow;
  }

  async update(id: string, data: Partial<DoctorRow>): Promise<DoctorRow> {
    return prisma.doctor.update({
      where: { id },
      data: {
        specialization: data.specialization ?? undefined,
        consultationFee: (data.consultationFee as number) ?? undefined,
        yearsOfExperience: data.yearsOfExperience ?? undefined
      }
    }) as unknown as DoctorRow;
  }

  async delete(id: string): Promise<void> {
    await prisma.doctor.delete({ where: { id } });
  }
}

export const doctorRepository = new DoctorRepository();
