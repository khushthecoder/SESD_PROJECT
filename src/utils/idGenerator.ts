import crypto from "crypto";

const PREFIXES: Record<string, string> = {
  user: "usr", patient: "pat", doctor: "doc", appointment: "apt",
  prescription: "prx", invoice: "inv", feedback: "fbk", record: "rec",
  schedule: "sch", notification: "ntf",
};

export function generateId(entityType: keyof typeof PREFIXES): string {
  const prefix = PREFIXES[entityType] || "gen";
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString("hex");
  return `${prefix}_${timestamp}_${random}`;
}

export function generateOTP(length: number = 6): string {
  const max = Math.pow(10, length);
  return crypto.randomInt(0, max).toString().padStart(length, "0");
}

export function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function isValidId(id: string, entityType?: keyof typeof PREFIXES): boolean {
  if (!id || id.length < 10) return false;
  if (entityType) return id.startsWith(`${PREFIXES[entityType]}_`);
  return Object.values(PREFIXES).some((p) => id.startsWith(`${p}_`));
}
