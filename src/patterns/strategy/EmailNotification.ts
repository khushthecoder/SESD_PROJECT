import { NotificationChannel } from "../../models/enums/notification.enum";
import { logger } from "../../utils/logger";
import { INotificationStrategy, NotificationPayload } from "./INotificationStrategy";

export class EmailNotification implements INotificationStrategy {
  readonly channel = NotificationChannel.EMAIL;

  async send(payload: NotificationPayload): Promise<void> {
    logger.info("email:send", {
      to: payload.to ?? payload.userId,
      subject: payload.title,
      type: payload.type
    });
  }
}
