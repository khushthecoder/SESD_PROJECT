import { patientRepository, PatientRepository, PatientRow } from "../repositories/PatientRepository";
import { notFoundErr } from "../utils/httpError";

export interface UpdatePatientInput {
  dateOfBirth?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  emergencyContact?: string | null;
  address?: string | null;
}

export class PatientService {
  constructor(private readonly repo: PatientRepository = patientRepository) {}

  async list(skip?: number, take?: number): Promise<PatientRow[]> {
    return this.repo.findAll({ skip, take });
  }

  async getById(id: string): Promise<PatientRow> {
    const p = await this.repo.findById(id);
    if (!p) throw notFoundErr("patient not found");
    return p;
  }

  async getByUserId(userId: string): Promise<PatientRow> {
    const p = await this.repo.findByUserId(userId);
    if (!p) throw notFoundErr("patient not found");
    return p;
  }

  async update(id: string, input: UpdatePatientInput): Promise<PatientRow> {
    await this.getById(id);
    return this.repo.update(id, input);
  }
}

export const patientService = new PatientService();
