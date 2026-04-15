import { emailSchema, passwordSchema, phoneSchema, nameSchema, paginationSchema } from "../src/utils/validators";

describe("Validation Schemas", () => {
  describe("emailSchema", () => {
    it("should accept valid email", () => { expect(() => emailSchema.parse("user@example.com")).not.toThrow(); });
    it("should reject invalid email", () => { expect(() => emailSchema.parse("not-an-email")).toThrow(); });
    it("should reject empty string", () => { expect(() => emailSchema.parse("")).toThrow(); });
  });

  describe("passwordSchema", () => {
    it("should accept valid password", () => { expect(() => passwordSchema.parse("SecureP@ss1")).not.toThrow(); });
    it("should reject short password", () => { expect(() => passwordSchema.parse("Ab1!")).toThrow(); });
    it("should reject without uppercase", () => { expect(() => passwordSchema.parse("lowercase1!")).toThrow(); });
    it("should reject without number", () => { expect(() => passwordSchema.parse("NoNumber!Here")).toThrow(); });
    it("should reject without special char", () => { expect(() => passwordSchema.parse("NoSpecial1Here")).toThrow(); });
  });

  describe("phoneSchema", () => {
    it("should accept valid phone", () => { expect(() => phoneSchema.parse("+919876543210")).not.toThrow(); });
    it("should reject short phone", () => { expect(() => phoneSchema.parse("12345")).toThrow(); });
  });

  describe("nameSchema", () => {
    it("should accept valid name", () => { expect(() => nameSchema.parse("John Doe")).not.toThrow(); });
    it("should reject single char", () => { expect(() => nameSchema.parse("J")).toThrow(); });
  });

  describe("paginationSchema", () => {
    it("should provide defaults", () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
    it("should parse numeric strings", () => {
      const result = paginationSchema.parse({ page: "3", limit: "50" });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(50);
    });
  });
});
