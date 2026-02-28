import { IRepository } from "./IRepository";
import prisma from "../config/prisma";

interface MedicalRecordData {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  vitals: any;
}

export class MedicalRecordRepository implements IRepository<MedicalRecordData> {
  async findById(id: string): Promise<MedicalRecordData | null> {
    return prisma.medicalRecord.findUnique({ where: { id } });
  }

  async findAll(): Promise<MedicalRecordData[]> {
    return prisma.medicalRecord.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(data: Omit<MedicalRecordData, "id">): Promise<MedicalRecordData> {
    return prisma.medicalRecord.create({ data });
  }

  async update(id: string, data: Partial<MedicalRecordData>): Promise<MedicalRecordData> {
    return prisma.medicalRecord.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.medicalRecord.delete({ where: { id } });
  }

  async findByPatientId(patientId: string): Promise<MedicalRecordData[]> {
    return prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByDoctorId(doctorId: string): Promise<MedicalRecordData[]> {
    return prisma.medicalRecord.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByAppointmentId(appointmentId: string): Promise<MedicalRecordData | null> {
    return prisma.medicalRecord.findFirst({ where: { appointmentId } });
  }
}
