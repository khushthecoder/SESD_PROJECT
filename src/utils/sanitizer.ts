export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "***" + local.slice(-1);
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.slice(0, 3) + "****" + phone.slice(-3);
}
