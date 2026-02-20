import { User, UserProps } from "./User";
import { Role } from "../enums/role.enum";

export interface ReceptionistProps extends UserProps {
  shift?: string;
}

export class Receptionist extends User {
  readonly role = Role.RECEPTIONIST;
  private _shift: string;

  constructor(props: ReceptionistProps) {
    super(props);
    this._shift = props.shift ?? "morning";
  }

  get shift(): string { return this._shift; }

  getPermissions(): string[] {
    return [
      "patients:create",
      "patients:view",
      "appointments:book",
      "appointments:view",
      "billing:create",
      "billing:update-status"
    ];
  }

  getDashboard(): string { return "reception-dashboard"; }
}
