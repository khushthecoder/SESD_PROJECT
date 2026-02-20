import { Role } from "../../models/enums/role.enum";
import { User } from "../../models/entities/User";
import { Patient, PatientProps } from "../../models/entities/Patient";
import { Doctor, DoctorProps } from "../../models/entities/Doctor";
import { Admin, AdminProps } from "../../models/entities/Admin";
import { Receptionist, ReceptionistProps } from "../../models/entities/Receptionist";

export type CreateUserInput =
  | ({ role: Role.PATIENT } & PatientProps)
  | ({ role: Role.DOCTOR } & DoctorProps)
  | ({ role: Role.ADMIN } & AdminProps)
  | ({ role: Role.RECEPTIONIST } & ReceptionistProps);

/**
 * Factory Pattern — creates the correct User subclass based on role.
 * Centralizes object construction and keeps callers free of new-operator switches.
 */
export class UserFactory {
  static create(input: CreateUserInput): User {
    switch (input.role) {
      case Role.PATIENT:
        return new Patient(input);
      case Role.DOCTOR:
        return new Doctor(input);
      case Role.ADMIN:
        return new Admin(input);
      case Role.RECEPTIONIST:
        return new Receptionist(input);
      default: {
        const _exhaustive: never = input;
        throw new Error(`unknown role: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }
}
