import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

interface InvoiceCreateInput {
  patientId: string;
  appointmentId: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  discountPercentage?: number;
}

export class InvoiceService {
  async createInvoice(data: InvoiceCreateInput) {
    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18;
    const discount = data.discountPercentage
      ? subtotal * (data.discountPercentage / 100)
      : 0;

    const invoice = {
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      items,
      subtotal,
      tax: parseFloat(tax.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      totalAmount: parseFloat((subtotal + tax - discount).toFixed(2)),
      status: "PENDING",
    };

    logger.info(`Invoice created for patient ${data.patientId}`);
    return invoice;
  }

  async processPayment(invoiceId: string, paymentMethod: string) {
    logger.info(`Payment processed for invoice ${invoiceId} via ${paymentMethod}`);
    return {
      invoiceId,
      paymentMethod,
      status: "PAID",
      paidAt: new Date(),
    };
  }

  async getPatientInvoices(patientId: string) {
    logger.info(`Fetching invoices for patient ${patientId}`);
    return [];
  }

  calculateTax(subtotal: number, taxRate: number = 0.18): number {
    return parseFloat((subtotal * taxRate).toFixed(2));
  }
}
