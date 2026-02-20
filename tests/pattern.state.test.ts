import { AppointmentFactory } from "../src/patterns/factory/AppointmentFactory";
import { AppointmentType, AppointmentStatus } from "../src/models/enums/appointment.enum";
import { stateFor } from "../src/patterns/state/states";
import { InvalidTransitionError } from "../src/patterns/state/IAppointmentState";

describe("State Pattern — Appointment lifecycle", () => {
  const mkAppt = () =>
    AppointmentFactory.create(AppointmentType.CONSULTATION, {
      id: "a1",
      patientId: "p1",
      doctorId: "d1",
      timeSlotId: "ts1",
      baseFee: 500
    });

  test("happy path: Scheduled -> Confirmed -> InProgress -> Completed", () => {
    const a = mkAppt();
    let s = stateFor(a.status);
    s = s.confirm(a);
    expect(a.status).toBe(AppointmentStatus.CONFIRMED);
    s = s.start(a);
    expect(a.status).toBe(AppointmentStatus.IN_PROGRESS);
    s = s.complete(a);
    expect(a.status).toBe(AppointmentStatus.COMPLETED);
  });

  test("can cancel from Scheduled or Confirmed", () => {
    const a = mkAppt();
    const s = stateFor(a.status).cancel(a);
    expect(a.status).toBe(AppointmentStatus.CANCELLED);
    expect(s.name).toBe(AppointmentStatus.CANCELLED);
  });

  test("cannot complete from Scheduled", () => {
    const a = mkAppt();
    expect(() => stateFor(a.status).complete(a)).toThrow(InvalidTransitionError);
  });

  test("cannot transition from Completed", () => {
    const a = mkAppt();
    a.setStatus(AppointmentStatus.COMPLETED);
    const s = stateFor(a.status);
    expect(() => s.confirm(a)).toThrow(InvalidTransitionError);
    expect(() => s.start(a)).toThrow(InvalidTransitionError);
    expect(() => s.cancel(a)).toThrow(InvalidTransitionError);
  });

  test("cannot transition from Cancelled", () => {
    const a = mkAppt();
    a.setStatus(AppointmentStatus.CANCELLED);
    const s = stateFor(a.status);
    expect(() => s.confirm(a)).toThrow(InvalidTransitionError);
    expect(() => s.start(a)).toThrow(InvalidTransitionError);
    expect(() => s.complete(a)).toThrow(InvalidTransitionError);
  });
});
