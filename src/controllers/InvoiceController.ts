import { Request, Response } from "express";
import { InvoiceService } from "../services/InvoiceService";
import { asyncHandler } from "../utils/asyncHandler";

const invoiceService = new InvoiceService();

export class InvoiceController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({ success: true, data: invoice });
  });

  static processPayment = asyncHandler(async (req: Request, res: Response) => {
    const { paymentMethod } = req.body;
    const result = await invoiceService.processPayment(req.params.id, paymentMethod);
    res.json({ success: true, data: result });
  });

  static getPatientInvoices = asyncHandler(async (req: Request, res: Response) => {
    const invoices = await invoiceService.getPatientInvoices(req.params.patientId);
    res.json({ success: true, data: invoices });
  });
}
