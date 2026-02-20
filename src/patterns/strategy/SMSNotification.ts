import { NotificationChannel } from "../../models/enums/notification.enum";
import { logger } from "../../utils/logger";
import { INotificationStrategy, NotificationPayload } from "./INotificationStrategy";

export class SMSNotification implements INotificationStrategy {
  readonly channel = NotificationChannel.SMS;

  async send(payload: NotificationPayload): Promise<void> {
    logger.info("sms:send", {
      to: payload.to ?? payload.userId,
      body: payload.body.slice(0, 140),
      type: payload.type
    });
  }
}
