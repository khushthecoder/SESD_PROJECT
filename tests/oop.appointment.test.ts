import { AppointmentFactory } from "../src/patterns/factory/AppointmentFactory";
import { AppointmentType, AppointmentStatus } from "../src/models/enums/appointment.enum";
import {
  ConsultationAppointment,
  FollowUpAppointment,
  EmergencyAppointment
} from "../src/models/entities/Appointment";

describe("OOP — Appointment polymorphism and fees", () => {
  const base = { id: "a1", patientId: "p1", doctorId: "d1", timeSlotId: "ts1", baseFee: 1000 };

  test("Consultation fee == baseFee", () => {
    const a = AppointmentFactory.create(AppointmentType.CONSULTATION, base);
    expect(a).toBeInstanceOf(ConsultationAppointment);
    expect(a.calculateFee()).toBe(1000);
  });

  test("FollowUp fee == 50% baseFee", () => {
    const a = AppointmentFactory.create(AppointmentType.FOLLOWUP, base);
    expect(a).toBeInstanceOf(FollowUpAppointment);
    expect(a.calculateFee()).toBe(500);
  });

  test("Emergency fee == 150% baseFee", () => {
    const a = AppointmentFactory.create(AppointmentType.EMERGENCY, base);
    expect(a).toBeInstanceOf(EmergencyAppointment);
    expect(a.calculateFee()).toBe(1500);
  });

  test("initial status defaults to SCHEDULED", () => {
    const a = AppointmentFactory.create(AppointmentType.CONSULTATION, base);
    expect(a.status).toBe(AppointmentStatus.SCHEDULED);
  });

  test("toJSON includes calculated fee", () => {
    const a = AppointmentFactory.create(AppointmentType.EMERGENCY, base);
    const j = a.toJSON();
    expect(j.fee).toBe(1500);
    expect(j.type).toBe(AppointmentType.EMERGENCY);
  });
});
