export enum Department {
  GENERAL = "GENERAL",
  CARDIOLOGY = "CARDIOLOGY",
  DERMATOLOGY = "DERMATOLOGY",
  NEUROLOGY = "NEUROLOGY",
  ORTHOPEDICS = "ORTHOPEDICS",
  PEDIATRICS = "PEDIATRICS",
  PSYCHIATRY = "PSYCHIATRY",
  RADIOLOGY = "RADIOLOGY",
  SURGERY = "SURGERY",
  ENT = "ENT",
  OPHTHALMOLOGY = "OPHTHALMOLOGY",
  GYNECOLOGY = "GYNECOLOGY",
}

export enum DepartmentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export function getDepartmentLabel(dept: Department): string {
  const labels: Record<Department, string> = {
    [Department.GENERAL]: "General Medicine",
    [Department.CARDIOLOGY]: "Cardiology",
    [Department.DERMATOLOGY]: "Dermatology",
    [Department.NEUROLOGY]: "Neurology",
    [Department.ORTHOPEDICS]: "Orthopedics",
    [Department.PEDIATRICS]: "Pediatrics",
    [Department.PSYCHIATRY]: "Psychiatry",
    [Department.RADIOLOGY]: "Radiology",
    [Department.SURGERY]: "Surgery",
    [Department.ENT]: "Ear, Nose & Throat",
    [Department.OPHTHALMOLOGY]: "Ophthalmology",
    [Department.GYNECOLOGY]: "Gynecology",
  };
  return labels[dept];
}
