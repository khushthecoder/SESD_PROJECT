import { DayOfWeek, SlotDuration, ScheduleStatus } from "../enums/schedule.enum";

export class Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: SlotDuration;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    doctorId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    slotDuration: SlotDuration = SlotDuration.STANDARD,
    status: ScheduleStatus = ScheduleStatus.ACTIVE
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.slotDuration = slotDuration;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this.status === ScheduleStatus.ACTIVE;
  }

  getTotalSlots(): number {
    const [startH, startM] = this.startTime.split(":").map(Number);
    const [endH, endM] = this.endTime.split(":").map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    return Math.floor(totalMinutes / this.slotDuration);
  }
}
