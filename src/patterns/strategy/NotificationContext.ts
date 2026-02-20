import { NotificationChannel } from "../../models/enums/notification.enum";
import { INotificationStrategy, NotificationPayload } from "./INotificationStrategy";
import { EmailNotification } from "./EmailNotification";
import { SMSNotification } from "./SMSNotification";
import { PushNotification } from "./PushNotification";

export class NotificationContext {
  private strategy: INotificationStrategy;

  constructor(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: INotificationStrategy): void {
    this.strategy = strategy;
  }

  async deliver(payload: NotificationPayload): Promise<void> {
    await this.strategy.send(payload);
  }

  static forChannel(channel: NotificationChannel): NotificationContext {
    switch (channel) {
      case NotificationChannel.EMAIL: return new NotificationContext(new EmailNotification());
      case NotificationChannel.SMS:   return new NotificationContext(new SMSNotification());
      case NotificationChannel.PUSH:  return new NotificationContext(new PushNotification());
    }
  }
}
