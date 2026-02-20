import { AppointmentStatus, AppointmentType } from "../enums/appointment.enum";

export interface AppointmentProps {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  baseFee: number;
  status?: AppointmentStatus;
  reason?: string | null;
}

/**
 * Abstract Appointment base — polymorphic fee calculation.
 * Subclasses (Consultation / FollowUp / Emergency) override calculateFee()
 * to implement different pricing rules.
 */
export abstract class Appointment {
  protected readonly _id: string;
  protected readonly _patientId: string;
  protected readonly _doctorId: string;
  protected readonly _timeSlotId: string;
  protected readonly _baseFee: number;
  protected _status: AppointmentStatus;
  protected _reason: string | null;

  constructor(props: AppointmentProps) {
    this._id = props.id;
    this._patientId = props.patientId;
    this._doctorId = props.doctorId;
    this._timeSlotId = props.timeSlotId;
    this._baseFee = props.baseFee;
    this._status = props.status ?? AppointmentStatus.SCHEDULED;
    this._reason = props.reason ?? null;
  }

  get id(): string { return this._id; }
  get patientId(): string { return this._patientId; }
  get doctorId(): string { return this._doctorId; }
  get timeSlotId(): string { return this._timeSlotId; }
  get status(): AppointmentStatus { return this._status; }
  get reason(): string | null { return this._reason; }

  setStatus(status: AppointmentStatus): void { this._status = status; }

  abstract readonly type: AppointmentType;
  abstract calculateFee(): number;

  toJSON() {
    return {
      id: this._id,
      patientId: this._patientId,
      doctorId: this._doctorId,
      timeSlotId: this._timeSlotId,
      type: this.type,
      status: this._status,
      reason: this._reason,
      fee: this.calculateFee()
    };
  }
}

export class ConsultationAppointment extends Appointment {
  readonly type = AppointmentType.CONSULTATION;
  calculateFee(): number { return this._baseFee; }
}

export class FollowUpAppointment extends Appointment {
  readonly type = AppointmentType.FOLLOWUP;
  calculateFee(): number { return Math.round(this._baseFee * 0.5 * 100) / 100; }
}

export class EmergencyAppointment extends Appointment {
  readonly type = AppointmentType.EMERGENCY;
  calculateFee(): number { return Math.round(this._baseFee * 1.5 * 100) / 100; }
}
