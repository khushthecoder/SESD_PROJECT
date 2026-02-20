import { NotificationChannel, NotificationType } from "../../models/enums/notification.enum";
import { IObserver } from "./IObserver";
import { AppointmentEvent } from "./AppointmentSubject";
import { NotificationContext } from "../strategy/NotificationContext";
import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { prisma } from "../../config/prisma";
import { logger } from "../../utils/logger";

export class NotifyObserver implements IObserver<AppointmentEvent> {
  async update(event: AppointmentEvent): Promise<void> {
    const { title, body, type } = this.buildMessage(event);

    try {
      await prisma.notification.create({
        data: { userId: event.patientUserId, type, title, body }
      });
    } catch (err) {
      logger.warn("notification persist failed", { err: String(err) });
    }

    const push = NotificationContext.forChannel(NotificationChannel.PUSH);
    await push.deliver({ userId: event.patientUserId, type, title, body });

    const email = NotificationContext.forChannel(NotificationChannel.EMAIL);
    await email.deliver({ userId: event.patientUserId, type, title, body });
  }

  private buildMessage(event: AppointmentEvent): { title: string; body: string; type: NotificationType } {
    switch (event.to) {
      case AppointmentStatus.CONFIRMED:
        return { type: NotificationType.BOOKING_CONFIRMATION, title: "Appointment confirmed", body: `Your appointment ${event.appointmentId} is confirmed.` };
      case AppointmentStatus.IN_PROGRESS:
        return { type: NotificationType.REMINDER, title: "Appointment in progress", body: "Your appointment has started." };
      case AppointmentStatus.COMPLETED:
        return { type: NotificationType.PRESCRIPTION, title: "Appointment complete", body: "Your appointment is complete. Prescription will follow." };
      case AppointmentStatus.CANCELLED:
        return { type: NotificationType.REMINDER, title: "Appointment cancelled", body: "Your appointment has been cancelled." };
      default:
        return { type: NotificationType.REMINDER, title: "Appointment update", body: `Status: ${event.to}` };
    }
  }
}
