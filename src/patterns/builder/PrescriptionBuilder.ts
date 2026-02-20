import { Prescription, PrescriptionItem } from "../../models/entities/Prescription";

export class PrescriptionBuilder {
  private _appointmentId: string | null = null;
  private _items: PrescriptionItem[] = [];
  private _notes = "";

  forAppointment(appointmentId: string): this {
    this._appointmentId = appointmentId;
    return this;
  }

  addMedicine(medicine: string, dosage: string, frequency: string, durationDays: number, instructions?: string): this {
    if (!medicine.trim()) throw new Error("medicine name required");
    if (durationDays <= 0) throw new Error("durationDays must be positive");
    this._items.push({ medicine, dosage, frequency, durationDays, instructions });
    return this;
  }

  withNotes(notes: string): this {
    this._notes = notes;
    return this;
  }

  build(): Prescription {
    if (!this._appointmentId) throw new Error("appointmentId is required");
    if (!this._items.length) throw new Error("at least one medicine required");
    return new Prescription(this._appointmentId, this._items, this._notes, new Date());
  }
}
