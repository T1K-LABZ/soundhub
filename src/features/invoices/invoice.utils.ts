import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "./invoice.types";

export function getInvoiceTotal(invoice: Invoice): number {
  return invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

/**
 * Generates and downloads a PDF for the given invoice.
 * Think of jsPDF like a canvas — we position text and tables manually,
 * then hand the finished "canvas" to the browser as a downloadable file.
 */
export function downloadInvoicePdf(invoice: Invoice): void {
  const doc = new jsPDF();
  const total = getInvoiceTotal(invoice);
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setTextColor(212, 47, 35); // primary red
  doc.text("SoundHub", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("soundhub.co.ke  ·  info@soundhub.co.ke", 14, 29);

  doc.setFontSize(18);
  doc.setTextColor(31, 41, 51);
  doc.text("INVOICE", pageWidth - 14, 22, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoice.invoiceNumber, pageWidth - 14, 29, { align: "right" });

  // ── Divider ───────────────────────────────────────────────────────────────
  doc.setDrawColor(220);
  doc.line(14, 34, pageWidth - 14, 34);

  // ── Bill To / Date ────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("BILL TO", 14, 42);
  doc.text("DATE", pageWidth - 60, 42);

  doc.setFontSize(11);
  doc.setTextColor(31, 41, 51);
  doc.text(invoice.clientName, 14, 49);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(invoice.clientEmail, 14, 55);
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 51);
  doc.text(invoice.date, pageWidth - 60, 49);

  // ── Line items table ──────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 65,
    head: [["Description", "Qty", "Unit Price", "Amount"]],
    body: invoice.lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      formatKsh(item.unitPrice),
      formatKsh(item.quantity * item.unitPrice),
    ]),
    headStyles: { fillColor: [212, 47, 35], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 40 },
      3: { halign: "right", cellWidth: 40 },
    },
    styles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  // ── Total ─────────────────────────────────────────────────────────────────
  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 8;

  doc.setFontSize(12);
  doc.setTextColor(31, 41, 51);
  doc.text("Total:", pageWidth - 60, finalY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(212, 47, 35);
  doc.text(formatKsh(total), pageWidth - 14, finalY, { align: "right" });
  doc.setFont("helvetica", "normal");

  // ── Notes ─────────────────────────────────────────────────────────────────
  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Notes:", 14, finalY);
    doc.setTextColor(31, 41, 51);
    doc.text(invoice.notes, 14, finalY + 6);
  }

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
