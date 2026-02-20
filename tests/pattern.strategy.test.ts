import { NotificationContext } from "../src/patterns/strategy/NotificationContext";
import { EmailNotification } from "../src/patterns/strategy/EmailNotification";
import { SMSNotification } from "../src/patterns/strategy/SMSNotification";
import { PushNotification } from "../src/patterns/strategy/PushNotification";
import { NotificationChannel, NotificationType } from "../src/models/enums/notification.enum";

describe("Strategy Pattern — NotificationContext", () => {
  const payload = {
    userId: "u1",
    type: NotificationType.BOOKING_CONFIRMATION,
    title: "t",
    body: "b"
  };

  test("forChannel returns correct strategy instance", () => {
    const e = NotificationContext.forChannel(NotificationChannel.EMAIL);
    const s = NotificationContext.forChannel(NotificationChannel.SMS);
    const p = NotificationContext.forChannel(NotificationChannel.PUSH);
    expect(e).toBeInstanceOf(NotificationContext);
    expect(s).toBeInstanceOf(NotificationContext);
    expect(p).toBeInstanceOf(NotificationContext);
  });

  test("setStrategy allows runtime swap", async () => {
    const calls: string[] = [];
    const email = new EmailNotification();
    const sms = new SMSNotification();
    const push = new PushNotification();
    jest.spyOn(email, "send").mockImplementation(async () => { calls.push("email"); });
    jest.spyOn(sms, "send").mockImplementation(async () => { calls.push("sms"); });
    jest.spyOn(push, "send").mockImplementation(async () => { calls.push("push"); });

    const ctx = new NotificationContext(email);
    await ctx.deliver(payload);
    ctx.setStrategy(sms);
    await ctx.deliver(payload);
    ctx.setStrategy(push);
    await ctx.deliver(payload);

    expect(calls).toEqual(["email", "sms", "push"]);
  });
});
