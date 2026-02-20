import { UserFactory } from "../src/patterns/factory/UserFactory";
import { Role } from "../src/models/enums/role.enum";
import { Patient } from "../src/models/entities/Patient";
import { Doctor } from "../src/models/entities/Doctor";
import { Admin } from "../src/models/entities/Admin";
import { Receptionist } from "../src/models/entities/Receptionist";

describe("OOP — User hierarchy", () => {
  test("UserFactory produces a Patient with correct permissions and dashboard", () => {
    const u = UserFactory.create({
      role: Role.PATIENT,
      id: "u1",
      email: "p@x.com",
      firstName: "Pat",
      lastName: "Zero"
    });
    expect(u).toBeInstanceOf(Patient);
    expect(u.role).toBe(Role.PATIENT);
    expect(u.getDashboard()).toBe("patient-dashboard");
    expect(u.getPermissions()).toContain("appointments:book");
  });

  test("UserFactory produces a Doctor with specialization and fee enforcement", () => {
    const u = UserFactory.create({
      role: Role.DOCTOR,
      id: "u2",
      email: "d@x.com",
      firstName: "Dr",
      lastName: "House",
      licenseNumber: "LIC-1",
      specialization: "cardiology",
      consultationFee: 700
    }) as Doctor;
    expect(u).toBeInstanceOf(Doctor);
    expect(u.specialization).toBe("cardiology");
    expect(u.consultationFee).toBe(700);
    expect(() => u.setConsultationFee(-1)).toThrow();
    u.setConsultationFee(1000);
    expect(u.consultationFee).toBe(1000);
  });

  test("Admin and Receptionist have role-specific permissions", () => {
    const a = UserFactory.create({ role: Role.ADMIN, id: "u3", email: "a@x.com", firstName: "A", lastName: "B" }) as Admin;
    const r = UserFactory.create({ role: Role.RECEPTIONIST, id: "u4", email: "r@x.com", firstName: "R", lastName: "C" }) as Receptionist;
    expect(a.getPermissions()).toContain("users:*");
    expect(r.getPermissions()).toContain("billing:create");
  });

  test("deactivate / activate toggle preserves encapsulation via methods", () => {
    const u = UserFactory.create({
      role: Role.PATIENT,
      id: "u5",
      email: "p2@x.com",
      firstName: "P",
      lastName: "Q"
    });
    expect(u.active).toBe(true);
    u.deactivate();
    expect(u.active).toBe(false);
    u.activate();
    expect(u.active).toBe(true);
  });
});
