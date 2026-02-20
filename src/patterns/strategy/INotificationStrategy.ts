import { NotificationChannel, NotificationType } from "../../models/enums/notification.enum";

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  to?: string;
}

export interface INotificationStrategy {
  readonly channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<void>;
}
