import { formatDate, addDays, isWeekday, getTimeDiffInMinutes, parseTimeSlot } from "../src/utils/dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format date to YYYY-MM-DD", () => {
      const date = new Date("2026-03-12T10:00:00Z");
      expect(formatDate(date)).toBe("2026-03-12");
    });
  });

  describe("addDays", () => {
    it("should add days to a date", () => {
      const date = new Date("2026-03-01");
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(6);
    });

    it("should handle month boundaries", () => {
      const date = new Date("2026-02-27");
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(2); // March
    });
  });

  describe("isWeekday", () => {
    it("should return true for weekdays", () => {
      const monday = new Date("2026-03-09"); // Monday
      expect(isWeekday(monday)).toBe(true);
    });

    it("should return false for weekends", () => {
      const sunday = new Date("2026-03-08"); // Sunday
      expect(isWeekday(sunday)).toBe(false);
    });
  });

  describe("getTimeDiffInMinutes", () => {
    it("should calculate time difference", () => {
      const start = new Date("2026-03-12T09:00:00");
      const end = new Date("2026-03-12T09:45:00");
      expect(getTimeDiffInMinutes(start, end)).toBe(45);
    });
  });

  describe("parseTimeSlot", () => {
    it("should parse time slot string", () => {
      expect(parseTimeSlot("14:30")).toEqual({ hours: 14, minutes: 30 });
    });
  });
});
