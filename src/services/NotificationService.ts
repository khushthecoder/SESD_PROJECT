import { logger } from "../utils/logger";

interface NotificationPayload {
  userId: string;
  type: "EMAIL" | "SMS" | "PUSH";
  subject: string;
  message: string;
  metadata?: Record<string, any>;
}

interface NotificationResult {
  success: boolean;
  notificationId: string;
  timestamp: Date;
}

export class NotificationService {
  private queue: NotificationPayload[] = [];

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    logger.info(`Sending ${payload.type} notification to user ${payload.userId}`);

    const notificationId = this.generateId();

    switch (payload.type) {
      case "EMAIL":
        await this.sendEmail(payload);
        break;
      case "SMS":
        await this.sendSMS(payload);
        break;
      case "PUSH":
        await this.sendPush(payload);
        break;
    }

    return {
      success: true,
      notificationId,
      timestamp: new Date(),
    };
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<NotificationResult[]> {
    return Promise.all(payloads.map((p) => this.send(p)));
  }

  private async sendEmail(payload: NotificationPayload): Promise<void> {
    logger.info(`Email sent: ${payload.subject} to ${payload.userId}`);
  }

  private async sendSMS(payload: NotificationPayload): Promise<void> {
    logger.info(`SMS sent to ${payload.userId}: ${payload.message}`);
  }

  private async sendPush(payload: NotificationPayload): Promise<void> {
    logger.info(`Push sent to ${payload.userId}: ${payload.subject}`);
  }

  enqueue(payload: NotificationPayload): void {
    this.queue.push(payload);
  }

  async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const payload = this.queue.shift()!;
      await this.send(payload);
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}
