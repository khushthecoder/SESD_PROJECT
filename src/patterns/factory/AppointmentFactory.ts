import { AppointmentType } from "../../models/enums/appointment.enum";
import {
  Appointment,
  AppointmentProps,
  ConsultationAppointment,
  FollowUpAppointment,
  EmergencyAppointment
} from "../../models/entities/Appointment";

export class AppointmentFactory {
  static create(type: AppointmentType, props: AppointmentProps): Appointment {
    switch (type) {
      case AppointmentType.CONSULTATION: return new ConsultationAppointment(props);
      case AppointmentType.FOLLOWUP:     return new FollowUpAppointment(props);
      case AppointmentType.EMERGENCY:    return new EmergencyAppointment(props);
      default: {
        const _exhaustive: never = type;
        throw new Error(`unknown appointment type: ${String(_exhaustive)}`);
      }
    }
  }
}
