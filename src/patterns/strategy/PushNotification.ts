import { NotificationChannel } from "../../models/enums/notification.enum";
import { emitToUser } from "../../config/socket";
import { INotificationStrategy, NotificationPayload } from "./INotificationStrategy";

export class PushNotification implements INotificationStrategy {
  readonly channel = NotificationChannel.PUSH;

  async send(payload: NotificationPayload): Promise<void> {
    emitToUser(payload.userId, "notification", {
      type: payload.type,
      title: payload.title,
      body: payload.body,
      at: new Date().toISOString()
    });
  }
}
