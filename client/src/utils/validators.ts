export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain an uppercase letter";
  if (!/[0-9]/.test(password)) return "Must contain a number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Must contain a special character";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone number is required";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 10 || cleaned.length > 15) return "Invalid phone number";
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be at most 50 characters";
  return null;
}

export function validateAge(age: number | string): string | null {
  const ageNum = typeof age === "string" ? parseInt(age) : age;
  if (isNaN(ageNum)) return "Invalid age";
  if (ageNum < 0 || ageNum > 150) return "Age must be between 0 and 150";
  return null;
}

export function validateLoginForm(data: { email: string; password: string }): ValidationResult {
  const errors: Record<string, string> = {};
  const emailErr = validateEmail(data.email);
  const passErr = validatePassword(data.password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return { isValid: Object.keys(errors).length === 0, errors };
}
