export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  date: string; // ISO date string
  lineItems: InvoiceLineItem[];
  notes: string;
};

export type InvoiceFormValues = Omit<Invoice, "id" | "invoiceNumber">;
