import type { Invoice } from "./invoice.types";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    clientName: "Beats & Bobs Studio",
    clientEmail: "studio@beatsbobs.co.ke",
    date: "2026-05-10",
    notes: "Payment due within 30 days.",
    lineItems: [
      {
        description: "Yamaha HS8 Studio Monitor",
        quantity: 2,
        unitPrice: 45000,
      },
      { description: "Shure SM7B Microphone", quantity: 1, unitPrice: 32000 },
    ],
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    clientName: "Nairobi Sound Church",
    clientEmail: "tech@nairobisound.org",
    date: "2026-05-18",
    notes: "Bulk order — 5% discount applied.",
    lineItems: [
      { description: "Focusrite Scarlett 2i2", quantity: 3, unitPrice: 18500 },
      { description: "Roland TD-17 Drum Kit", quantity: 1, unitPrice: 120000 },
    ],
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    clientName: "DJ Mwangi Events",
    clientEmail: "bookings@djmwangi.co.ke",
    date: "2026-06-01",
    notes: "",
    lineItems: [
      {
        description: "Native Instruments Komplete",
        quantity: 1,
        unitPrice: 52000,
      },
    ],
  },
];
