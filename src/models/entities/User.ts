import { Role } from "../enums/role.enum";

export interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  active?: boolean;
}

export abstract class User {
  protected readonly _id: string;
  protected _email: string;
  protected _firstName: string;
  protected _lastName: string;
  protected _phone: string | null;
  protected _active: boolean;

  constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._phone = props.phone ?? null;
    this._active = props.active ?? true;
  }

  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get active(): boolean { return this._active; }

  deactivate(): void { this._active = false; }
  activate(): void { this._active = true; }

  abstract readonly role: Role;
  abstract getPermissions(): string[];
  abstract getDashboard(): string;

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      phone: this._phone,
      active: this._active,
      role: this.role
    };
  }
}
