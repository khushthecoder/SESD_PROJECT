import { sanitizeString, sanitizeObject, stripHtml, normalizeWhitespace, maskEmail, maskPhone } from "../src/utils/sanitizer";

describe("Sanitizer Utilities", () => {
  describe("sanitizeString", () => {
    it("should escape HTML characters", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe("&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;");
    });
    it("should trim whitespace", () => { expect(sanitizeString("  hello  ")).toBe("hello"); });
    it("should escape quotes", () => { expect(sanitizeString('"test"')).toBe("&quot;test&quot;"); });
  });

  describe("sanitizeObject", () => {
    it("should sanitize string values", () => {
      const result = sanitizeObject({ name: "<b>Test</b>", age: 25 });
      expect(result.name).toBe("&lt;b&gt;Test&lt;/b&gt;");
      expect(result.age).toBe(25);
    });
    it("should handle nested objects", () => {
      const result = sanitizeObject({ user: { name: "<script>x</script>" } });
      expect(result.user.name).toContain("&lt;script&gt;");
    });
  });

  describe("stripHtml", () => {
    it("should remove HTML tags", () => { expect(stripHtml("<p>Hello <b>World</b></p>")).toBe("Hello World"); });
  });

  describe("normalizeWhitespace", () => {
    it("should collapse multiple spaces", () => { expect(normalizeWhitespace("hello    world")).toBe("hello world"); });
  });

  describe("maskEmail", () => {
    it("should mask email", () => { expect(maskEmail("john.doe@example.com")).toBe("jo***e@example.com"); });
  });

  describe("maskPhone", () => {
    it("should mask phone", () => { expect(maskPhone("+919876543210")).toBe("+91****210"); });
  });
});
