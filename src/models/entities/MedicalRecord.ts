export interface IMedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  vitals: Vitals;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vitals {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
}

export class MedicalRecord implements IMedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  vitals: Vitals;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IMedicalRecord) {
    this.id = data.id;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.appointmentId = data.appointmentId;
    this.diagnosis = data.diagnosis;
    this.symptoms = data.symptoms;
    this.notes = data.notes;
    this.vitals = data.vitals;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  getBMI(): number | null {
    if (this.vitals.weight && this.vitals.height) {
      const heightInMeters = this.vitals.height / 100;
      return parseFloat((this.vitals.weight / (heightInMeters ** 2)).toFixed(1));
    }
    return null;
  }

  hasAbnormalVitals(): boolean {
    const v = this.vitals;
    if (v.heartRate && (v.heartRate < 60 || v.heartRate > 100)) return true;
    if (v.temperature && (v.temperature < 36.1 || v.temperature > 37.8)) return true;
    if (v.oxygenSaturation && v.oxygenSaturation < 95) return true;
    return false;
  }
}
