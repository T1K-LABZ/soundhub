import type { Invoice } from "./invoice.types";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    clientName: "Beats & Bobs Studio",
    clientPhone: "0712345678",
    date: "2026-05-10",
    notes: "Payment due within 30 days.",
    lineItems: [
      {
        productId: "prod-1",
        description: "Yamaha HS8 Studio Monitor",
        quantity: 2,
        unitPrice: 45000,
      },
      {
        productId: "prod-2",
        description: "Shure SM7B Microphone",
        quantity: 1,
        unitPrice: 32000,
      },
    ],
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    clientName: "Nairobi Sound Church",
    clientPhone: "0723456789",
    date: "2026-05-18",
    notes: "Bulk order — 5% discount applied.",
    lineItems: [
      {
        productId: "prod-3",
        description: "Focusrite Scarlett 2i2",
        quantity: 3,
        unitPrice: 18500,
      },
      {
        productId: "prod-4",
        description: "Roland TD-17 Drum Kit",
        quantity: 1,
        unitPrice: 120000,
      },
    ],
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    clientName: "DJ Mwangi Events",
    clientPhone: "0734567890",
    date: "2026-06-01",
    notes: "",
    lineItems: [
      {
        productId: "prod-5",
        description: "Native Instruments Komplete",
        quantity: 1,
        unitPrice: 52000,
      },
    ],
  },
];
