export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export class Prescription {
  private readonly _appointmentId: string;
  private readonly _items: PrescriptionItem[];
  private readonly _notes: string;
  private readonly _createdAt: Date;

  constructor(appointmentId: string, items: PrescriptionItem[], notes: string, createdAt: Date) {
    if (!items.length) throw new Error("prescription must have at least one item");
    this._appointmentId = appointmentId;
    this._items = items;
    this._notes = notes;
    this._createdAt = createdAt;
  }

  get appointmentId(): string { return this._appointmentId; }
  get items(): readonly PrescriptionItem[] { return this._items; }
  get notes(): string { return this._notes; }
  get createdAt(): Date { return this._createdAt; }

  toJSON() {
    return {
      appointmentId: this._appointmentId,
      items: this._items,
      notes: this._notes,
      createdAt: this._createdAt.toISOString()
    };
  }
}
