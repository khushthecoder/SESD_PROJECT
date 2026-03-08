export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  OVERDUE = "OVERDUE",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
  INSURANCE = "INSURANCE",
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class Invoice {
  id: string;
  patientId: string;
  appointmentId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  createdAt: Date;

  constructor(
    id: string,
    patientId: string,
    appointmentId: string,
    items: InvoiceItem[]
  ) {
    this.id = id;
    this.patientId = patientId;
    this.appointmentId = appointmentId;
    this.items = items;
    this.subtotal = this.calculateSubtotal();
    this.tax = this.subtotal * 0.18;
    this.discount = 0;
    this.totalAmount = this.subtotal + this.tax - this.discount;
    this.status = InvoiceStatus.PENDING;
    this.createdAt = new Date();
  }

  private calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  applyDiscount(percentage: number): void {
    this.discount = this.subtotal * (percentage / 100);
    this.totalAmount = this.subtotal + this.tax - this.discount;
  }

  markAsPaid(method: PaymentMethod): void {
    this.status = InvoiceStatus.PAID;
    this.paymentMethod = method;
    this.paidAt = new Date();
  }

  isOverdue(dueDays: number = 30): boolean {
    if (this.status !== InvoiceStatus.PENDING) return false;
    const dueDate = new Date(this.createdAt);
    dueDate.setDate(dueDate.getDate() + dueDays);
    return new Date() > dueDate;
  }
}
