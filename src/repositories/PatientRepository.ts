import { prisma } from "../config/prisma";
import { IRepository } from "./IRepository";

export interface PatientRow {
  id: string;
  userId: string;
  dateOfBirth: Date | null;
  gender: string | null;
  bloodGroup: string | null;
  emergencyContact: string | null;
  address: string | null;
}

export class PatientRepository implements IRepository<PatientRow> {
  async findById(id: string): Promise<PatientRow | null> {
    return prisma.patient.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<PatientRow | null> {
    return prisma.patient.findUnique({ where: { userId } });
  }

  async findAll(opts: { skip?: number; take?: number } = {}): Promise<PatientRow[]> {
    return prisma.patient.findMany({
      skip: opts.skip ?? 0,
      take: opts.take ?? 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } }
    }) as unknown as Promise<PatientRow[]>;
  }

  async searchByUserEmail(q: string): Promise<PatientRow[]> {
    return prisma.patient.findMany({
      where: { user: { email: { contains: q, mode: "insensitive" } } },
      take: 20,
      include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } }
    }) as unknown as Promise<PatientRow[]>;
  }

  async create(data: Partial<PatientRow>): Promise<PatientRow> {
    if (!data.userId) throw new Error("userId required");
    return prisma.patient.create({
      data: {
        userId: data.userId,
        dateOfBirth: data.dateOfBirth ?? undefined,
        gender: data.gender ?? undefined,
        bloodGroup: data.bloodGroup ?? undefined,
        emergencyContact: data.emergencyContact ?? undefined,
        address: data.address ?? undefined
      }
    });
  }

  async update(id: string, data: Partial<PatientRow>): Promise<PatientRow> {
    return prisma.patient.update({
      where: { id },
      data: {
        dateOfBirth: data.dateOfBirth ?? undefined,
        gender: data.gender ?? undefined,
        bloodGroup: data.bloodGroup ?? undefined,
        emergencyContact: data.emergencyContact ?? undefined,
        address: data.address ?? undefined
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.patient.delete({ where: { id } });
  }
}

export const patientRepository = new PatientRepository();
