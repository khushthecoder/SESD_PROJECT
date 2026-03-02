import { MedicalRecordRepository } from "../repositories/MedicalRecordRepository";
import { HttpError } from "../utils/httpError";

const medicalRecordRepo = new MedicalRecordRepository();

export class MedicalRecordService {
  async createRecord(data: {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    diagnosis: string;
    symptoms: string[];
    notes: string;
    vitals: Record<string, any>;
  }) {
    const existingRecord = await medicalRecordRepo.findByAppointmentId(data.appointmentId);
    if (existingRecord) {
      throw new HttpError(409, "Medical record already exists for this appointment");
    }
    return medicalRecordRepo.create(data);
  }

  async getRecordById(id: string) {
    const record = await medicalRecordRepo.findById(id);
    if (!record) {
      throw new HttpError(404, "Medical record not found");
    }
    return record;
  }

  async getPatientHistory(patientId: string) {
    return medicalRecordRepo.findByPatientId(patientId);
  }

  async updateRecord(id: string, data: Partial<{
    diagnosis: string;
    symptoms: string[];
    notes: string;
    vitals: Record<string, any>;
  }>) {
    const record = await medicalRecordRepo.findById(id);
    if (!record) {
      throw new HttpError(404, "Medical record not found");
    }
    return medicalRecordRepo.update(id, data);
  }

  async getRecordsByDoctor(doctorId: string) {
    return medicalRecordRepo.findByDoctorId(doctorId);
  }
}
