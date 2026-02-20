import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { Appointment } from "../../models/entities/Appointment";

export interface IAppointmentState {
  readonly name: AppointmentStatus;
  confirm(ctx: Appointment): IAppointmentState;
  start(ctx: Appointment): IAppointmentState;
  complete(ctx: Appointment): IAppointmentState;
  cancel(ctx: Appointment): IAppointmentState;
}

export class InvalidTransitionError extends Error {
  constructor(from: AppointmentStatus, action: string) {
    super(`cannot ${action} appointment in state ${from}`);
    this.name = "InvalidTransitionError";
  }
}
