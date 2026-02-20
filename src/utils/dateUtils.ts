export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function getTimeDiffInMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

export function parseTimeSlot(slot: string): { hours: number; minutes: number } {
  const [hours, minutes] = slot.split(":").map(Number);
  return { hours, minutes };
}
