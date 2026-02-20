import { doctorRepository, DoctorRepository, DoctorRow } from "../repositories/DoctorRepository";
import { notFoundErr } from "../utils/httpError";

export class DoctorService {
  constructor(private readonly repo: DoctorRepository = doctorRepository) {}

  async list(skip?: number, take?: number): Promise<DoctorRow[]> {
    return this.repo.findAll({ skip, take });
  }

  async getById(id: string): Promise<DoctorRow> {
    const d = await this.repo.findById(id);
    if (!d) throw notFoundErr("doctor not found");
    return d;
  }

  async searchBySpecialization(specialization: string): Promise<DoctorRow[]> {
    return this.repo.findBySpecialization(specialization);
  }

  async updateFee(id: string, fee: number): Promise<DoctorRow> {
    await this.getById(id);
    return this.repo.update(id, { consultationFee: fee as unknown });
  }
}

export const doctorService = new DoctorService();
