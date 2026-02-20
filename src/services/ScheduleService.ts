import { prisma } from "../config/prisma";
import { badRequest, notFoundErr } from "../utils/httpError";
import { cacheDel, cacheGet, cacheSet, redis } from "../config/redis";

export interface ScheduleInput {
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes?: number;
}

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseHHMM(s: string): { h: number; m: number } {
  const match = TIME_RE.exec(s);
  if (!match) throw badRequest(`invalid time format: ${s}, expected HH:MM`);
  return { h: Number(match[1]), m: Number(match[2]) };
}

function toMinutes(t: string): number {
  const { h, m } = parseHHMM(t);
  return h * 60 + m;
}

export class ScheduleService {
  async setWeeklySchedule(doctorId: string, input: ScheduleInput) {
    if (input.weekday < 0 || input.weekday > 6) throw badRequest("weekday must be 0..6");
    if (toMinutes(input.endTime) <= toMinutes(input.startTime)) {
      throw badRequest("endTime must be after startTime");
    }
    const slotMinutes = input.slotMinutes ?? 30;
    if (slotMinutes < 5 || slotMinutes > 240) throw badRequest("slotMinutes must be 5..240");

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw notFoundErr("doctor not found");

    const schedule = await prisma.schedule.upsert({
      where: { doctorId_weekday: { doctorId, weekday: input.weekday } },
      update: { startTime: input.startTime, endTime: input.endTime, slotMinutes, active: true },
      create: { doctorId, weekday: input.weekday, startTime: input.startTime, endTime: input.endTime, slotMinutes }
    });

    await this.invalidateSlotsCache(doctorId);
    return schedule;
  }

  private async invalidateSlotsCache(doctorId: string): Promise<void> {
    const client = redis();
    if (!client) return;
    const keys = await client.keys(`slots:${doctorId}:*`);
    if (keys.length) await client.del(...keys);
  }

  async generateSlotsForDate(doctorId: string, dateISO: string) {
    const date = new Date(dateISO + "T00:00:00.000Z");
    if (isNaN(date.getTime())) throw badRequest("invalid date");

    const weekday = date.getUTCDay();
    const schedule = await prisma.schedule.findUnique({
      where: { doctorId_weekday: { doctorId, weekday } }
    });
    if (!schedule || !schedule.active) return [];

    const { h: sh, m: sm } = parseHHMM(schedule.startTime);
    const { h: eh, m: em } = parseHHMM(schedule.endTime);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    const slots: { doctorId: string; startsAt: Date; endsAt: Date }[] = [];
    for (let cur = startMin; cur + schedule.slotMinutes <= endMin; cur += schedule.slotMinutes) {
      const starts = new Date(date);
      starts.setUTCHours(Math.floor(cur / 60), cur % 60, 0, 0);
      const ends = new Date(starts.getTime() + schedule.slotMinutes * 60 * 1000);
      slots.push({ doctorId, startsAt: starts, endsAt: ends });
    }

    const created = await Promise.all(
      slots.map((s) =>
        prisma.timeSlot.upsert({
          where: { doctorId_startsAt: { doctorId: s.doctorId, startsAt: s.startsAt } },
          update: {},
          create: s
        })
      )
    );

    await cacheDel(`slots:${doctorId}:${dateISO}`);
    return created;
  }

  async getAvailableSlots(doctorId: string, dateISO: string) {
    const cacheKey = `slots:${doctorId}:${dateISO}`;
    const cached = await cacheGet<unknown>(cacheKey);
    if (cached) return cached;

    await this.generateSlotsForDate(doctorId, dateISO);

    const start = new Date(dateISO + "T00:00:00.000Z");
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const slots = await prisma.timeSlot.findMany({
      where: { doctorId, startsAt: { gte: start, lt: end }, booked: false },
      orderBy: { startsAt: "asc" }
    });

    await cacheSet(cacheKey, slots, 300);
    return slots;
  }
}

export const scheduleService = new ScheduleService();
