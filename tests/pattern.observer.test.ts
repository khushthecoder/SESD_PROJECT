import { AppointmentSubject, AppointmentEvent } from "../src/patterns/observer/AppointmentSubject";
import { IObserver } from "../src/patterns/observer/IObserver";
import { AppointmentStatus } from "../src/models/enums/appointment.enum";

describe("Observer Pattern — AppointmentSubject", () => {
  test("subscribed observers receive notify events", async () => {
    const received: AppointmentEvent[] = [];
    const obs: IObserver<AppointmentEvent> = { update: (e) => { received.push(e); } };

    const subject = AppointmentSubject.instance();
    subject.subscribe(obs);

    const event: AppointmentEvent = {
      appointmentId: "a1",
      patientUserId: "u1",
      doctorUserId: "u2",
      from: AppointmentStatus.SCHEDULED,
      to: AppointmentStatus.CONFIRMED,
      at: new Date()
    };
    await subject.notify(event);
    expect(received).toHaveLength(1);
    expect(received[0].to).toBe(AppointmentStatus.CONFIRMED);

    subject.unsubscribe(obs);
    await subject.notify(event);
    expect(received).toHaveLength(1);
  });

  test("singleton returns the same instance", () => {
    expect(AppointmentSubject.instance()).toBe(AppointmentSubject.instance());
  });
});
