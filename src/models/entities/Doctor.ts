import { User, UserProps } from "./User";
import { Role } from "../enums/role.enum";

export interface DoctorProps extends UserProps {
  licenseNumber: string;
  specialization: string;
  consultationFee: number;
  yearsOfExperience?: number;
}

export class Doctor extends User {
  readonly role = Role.DOCTOR;
  private _licenseNumber: string;
  private _specialization: string;
  private _consultationFee: number;
  private _yearsOfExperience: number;

  constructor(props: DoctorProps) {
    super(props);
    this._licenseNumber = props.licenseNumber;
    this._specialization = props.specialization;
    this._consultationFee = props.consultationFee;
    this._yearsOfExperience = props.yearsOfExperience ?? 0;
  }

  get specialization(): string { return this._specialization; }
  get consultationFee(): number { return this._consultationFee; }
  get licenseNumber(): string { return this._licenseNumber; }
  get yearsOfExperience(): number { return this._yearsOfExperience; }

  setConsultationFee(fee: number): void {
    if (fee < 0) throw new Error("fee cannot be negative");
    this._consultationFee = fee;
  }

  getPermissions(): string[] {
    return [
      "appointments:view:assigned",
      "appointments:update-status",
      "prescriptions:create",
      "prescriptions:view:assigned",
      "schedule:manage:self",
      "medical-records:create"
    ];
  }

  getDashboard(): string { return "doctor-dashboard"; }
}
