import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { Appointment } from "../../models/entities/Appointment";
import { IAppointmentState, InvalidTransitionError } from "./IAppointmentState";

export class ScheduledState implements IAppointmentState {
  readonly name = AppointmentStatus.SCHEDULED;
  confirm(ctx: Appointment): IAppointmentState {
    ctx.setStatus(AppointmentStatus.CONFIRMED);
    return new ConfirmedState();
  }
  start(): IAppointmentState { throw new InvalidTransitionError(this.name, "start"); }
  complete(): IAppointmentState { throw new InvalidTransitionError(this.name, "complete"); }
  cancel(ctx: Appointment): IAppointmentState {
    ctx.setStatus(AppointmentStatus.CANCELLED);
    return new CancelledState();
  }
}

export class ConfirmedState implements IAppointmentState {
  readonly name = AppointmentStatus.CONFIRMED;
  confirm(): IAppointmentState { throw new InvalidTransitionError(this.name, "confirm"); }
  start(ctx: Appointment): IAppointmentState {
    ctx.setStatus(AppointmentStatus.IN_PROGRESS);
    return new InProgressState();
  }
  complete(): IAppointmentState { throw new InvalidTransitionError(this.name, "complete"); }
  cancel(ctx: Appointment): IAppointmentState {
    ctx.setStatus(AppointmentStatus.CANCELLED);
    return new CancelledState();
  }
}

export class InProgressState implements IAppointmentState {
  readonly name = AppointmentStatus.IN_PROGRESS;
  confirm(): IAppointmentState { throw new InvalidTransitionError(this.name, "confirm"); }
  start(): IAppointmentState { throw new InvalidTransitionError(this.name, "start"); }
  complete(ctx: Appointment): IAppointmentState {
    ctx.setStatus(AppointmentStatus.COMPLETED);
    return new CompletedState();
  }
  cancel(): IAppointmentState { throw new InvalidTransitionError(this.name, "cancel"); }
}

export class CompletedState implements IAppointmentState {
  readonly name = AppointmentStatus.COMPLETED;
  confirm(): IAppointmentState { throw new InvalidTransitionError(this.name, "confirm"); }
  start(): IAppointmentState { throw new InvalidTransitionError(this.name, "start"); }
  complete(): IAppointmentState { throw new InvalidTransitionError(this.name, "complete"); }
  cancel(): IAppointmentState { throw new InvalidTransitionError(this.name, "cancel"); }
}

export class CancelledState implements IAppointmentState {
  readonly name = AppointmentStatus.CANCELLED;
  confirm(): IAppointmentState { throw new InvalidTransitionError(this.name, "confirm"); }
  start(): IAppointmentState { throw new InvalidTransitionError(this.name, "start"); }
  complete(): IAppointmentState { throw new InvalidTransitionError(this.name, "complete"); }
  cancel(): IAppointmentState { throw new InvalidTransitionError(this.name, "cancel"); }
}

export function stateFor(status: AppointmentStatus): IAppointmentState {
  switch (status) {
    case AppointmentStatus.SCHEDULED:   return new ScheduledState();
    case AppointmentStatus.CONFIRMED:   return new ConfirmedState();
    case AppointmentStatus.IN_PROGRESS: return new InProgressState();
    case AppointmentStatus.COMPLETED:   return new CompletedState();
    case AppointmentStatus.CANCELLED:   return new CancelledState();
  }
}
