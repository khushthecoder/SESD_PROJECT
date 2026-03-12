import { InvoiceService } from "../src/services/InvoiceService";

describe("InvoiceService", () => {
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceService = new InvoiceService();
  });

  describe("calculateTax", () => {
    it("should calculate 18% tax by default", () => {
      expect(invoiceService.calculateTax(1000)).toBe(180);
    });

    it("should calculate tax with custom rate", () => {
      expect(invoiceService.calculateTax(1000, 0.12)).toBe(120);
    });

    it("should handle zero subtotal", () => {
      expect(invoiceService.calculateTax(0)).toBe(0);
    });

    it("should round to 2 decimal places", () => {
      expect(invoiceService.calculateTax(33.33)).toBe(6);
    });
  });

  describe("createInvoice", () => {
    it("should create invoice with correct totals", async () => {
      const result = await invoiceService.createInvoice({
        patientId: "p1",
        appointmentId: "a1",
        items: [
          { description: "Consultation", quantity: 1, unitPrice: 500 },
          { description: "Blood Test", quantity: 2, unitPrice: 200 },
        ],
      });

      expect(result.subtotal).toBe(900);
      expect(result.status).toBe("PENDING");
      expect(result.items).toHaveLength(2);
    });

    it("should apply discount correctly", async () => {
      const result = await invoiceService.createInvoice({
        patientId: "p1",
        appointmentId: "a1",
        items: [{ description: "Consultation", quantity: 1, unitPrice: 1000 }],
        discountPercentage: 10,
      });

      expect(result.discount).toBe(100);
    });
  });
});
