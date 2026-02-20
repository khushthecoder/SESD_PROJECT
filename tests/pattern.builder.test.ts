import { PrescriptionBuilder } from "../src/patterns/builder/PrescriptionBuilder";

describe("Builder Pattern — PrescriptionBuilder", () => {
  test("builds a valid prescription with fluent API", () => {
    const rx = new PrescriptionBuilder()
      .forAppointment("a1")
      .addMedicine("Amoxicillin", "500mg", "TID", 7, "after meals")
      .addMedicine("Paracetamol", "650mg", "BID", 3)
      .withNotes("rest 3 days")
      .build();
    expect(rx.appointmentId).toBe("a1");
    expect(rx.items).toHaveLength(2);
    expect(rx.notes).toBe("rest 3 days");
  });

  test("throws if no appointmentId set", () => {
    expect(() =>
      new PrescriptionBuilder().addMedicine("X", "1", "OD", 1).build()
    ).toThrow(/appointmentId/);
  });

  test("throws if no medicines", () => {
    expect(() => new PrescriptionBuilder().forAppointment("a1").build()).toThrow(/medicine/);
  });

  test("rejects invalid duration", () => {
    expect(() =>
      new PrescriptionBuilder().forAppointment("a1").addMedicine("X", "1", "OD", 0)
    ).toThrow(/durationDays/);
  });
});
