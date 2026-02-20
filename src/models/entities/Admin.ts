import { User, UserProps } from "./User";
import { Role } from "../enums/role.enum";

export interface AdminProps extends UserProps {
  level?: number;
}

export class Admin extends User {
  readonly role = Role.ADMIN;
  private _level: number;

  constructor(props: AdminProps) {
    super(props);
    this._level = props.level ?? 1;
  }

  get level(): number { return this._level; }

  getPermissions(): string[] {
    return [
      "users:*",
      "departments:*",
      "appointments:*",
      "analytics:view",
      "audit:view",
      "billing:*"
    ];
  }

  getDashboard(): string { return "admin-dashboard"; }
}
