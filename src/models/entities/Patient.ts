import { User, UserProps } from "./User";
import { Role } from "../enums/role.enum";

export interface PatientProps extends UserProps {
  dateOfBirth?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  emergencyContact?: string | null;
  address?: string | null;
}

export class Patient extends User {
  readonly role = Role.PATIENT;
  private _dateOfBirth: Date | null;
  private _gender: string | null;
  private _bloodGroup: string | null;
  private _emergencyContact: string | null;
  private _address: string | null;

  constructor(props: PatientProps) {
    super(props);
    this._dateOfBirth = props.dateOfBirth ?? null;
    this._gender = props.gender ?? null;
    this._bloodGroup = props.bloodGroup ?? null;
    this._emergencyContact = props.emergencyContact ?? null;
    this._address = props.address ?? null;
  }

  get age(): number | null {
    if (!this._dateOfBirth) return null;
    const diff = Date.now() - this._dateOfBirth.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  }

  getPermissions(): string[] {
    return [
      "appointments:book",
      "appointments:view:self",
      "appointments:cancel:self",
      "prescriptions:view:self",
      "billing:view:self",
      "profile:edit:self"
    ];
  }

  getDashboard(): string { return "patient-dashboard"; }
}
