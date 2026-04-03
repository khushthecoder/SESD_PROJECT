import { parsePagination, getSkip, buildPaginatedResult, buildCursorResult } from "../src/utils/pagination";

describe("Pagination Utilities", () => {
  describe("parsePagination", () => {
    it("should parse valid page and limit", () => {
      expect(parsePagination({ page: "2", limit: "20" })).toEqual({ page: 2, limit: 20 });
    });
    it("should default to page 1 and limit 20", () => {
      expect(parsePagination({})).toEqual({ page: 1, limit: 20 });
    });
    it("should cap limit at 100", () => {
      expect(parsePagination({ page: "1", limit: "500" })).toEqual({ page: 1, limit: 100 });
    });
    it("should floor page at 1", () => {
      expect(parsePagination({ page: "-5", limit: "10" })).toEqual({ page: 1, limit: 10 });
    });
  });

  describe("getSkip", () => {
    it("should calculate correct skip", () => {
      expect(getSkip({ page: 1, limit: 20 })).toBe(0);
      expect(getSkip({ page: 2, limit: 20 })).toBe(20);
      expect(getSkip({ page: 3, limit: 10 })).toBe(20);
    });
  });

  describe("buildPaginatedResult", () => {
    it("should build correct pagination metadata", () => {
      const result = buildPaginatedResult(["a", "b"], 50, { page: 2, limit: 10 });
      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);
    });
    it("should handle single page", () => {
      const result = buildPaginatedResult(["a"], 5, { page: 1, limit: 5 });
      expect(result.pagination.hasPrev).toBe(false);
      expect(result.pagination.hasNext).toBe(false);
    });
  });

  describe("buildCursorResult", () => {
    it("should set nextCursor when more data", () => {
      const data = [{ id: "1", name: "a" }, { id: "2", name: "b" }, { id: "3", name: "c" }];
      const result = buildCursorResult(data, 2);
      expect(result.data).toHaveLength(2);
      expect(result.nextCursor).toBe("2");
    });
    it("should return null cursor when no more data", () => {
      const result = buildCursorResult([{ id: "1", name: "a" }], 5);
      expect(result.nextCursor).toBeNull();
    });
  });
});
