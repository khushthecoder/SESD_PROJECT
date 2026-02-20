import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { IObserver, ISubject } from "./IObserver";

export interface AppointmentEvent {
  appointmentId: string;
  patientUserId: string;
  doctorUserId: string;
  from: AppointmentStatus;
  to: AppointmentStatus;
  at: Date;
}

export class AppointmentSubject implements ISubject<AppointmentEvent> {
  private static _instance: AppointmentSubject;
  private observers: IObserver<AppointmentEvent>[] = [];

  private constructor() {}

  static instance(): AppointmentSubject {
    if (!AppointmentSubject._instance) AppointmentSubject._instance = new AppointmentSubject();
    return AppointmentSubject._instance;
  }

  subscribe(obs: IObserver<AppointmentEvent>): void {
    if (!this.observers.includes(obs)) this.observers.push(obs);
  }

  unsubscribe(obs: IObserver<AppointmentEvent>): void {
    this.observers = this.observers.filter((o) => o !== obs);
  }

  async notify(event: AppointmentEvent): Promise<void> {
    await Promise.all(this.observers.map((o) => Promise.resolve(o.update(event))));
  }
}
