import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { MOCK_INVOICES } from "./invoice.data";
import type { Invoice } from "./invoice.types";
import { downloadInvoicePdf, getInvoiceTotal } from "./invoice.utils";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { InvoiceCard } from "./InvoiceCard";
import { InvoiceFiltersBar, type InvoiceFilters } from "./InvoiceFiltersBar";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import { InvoiceSummaryBar } from "./InvoiceSummaryBar";

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredInvoices = useMemo(() => {
    let result = invoices;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q) ||
          inv.clientPhone.toLowerCase().includes(q),
      );
    }

    if (filters.dateFrom) {
      result = result.filter((inv) => inv.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter((inv) => inv.date <= filters.dateTo);
    }

    return result;
  }, [invoices, filters]);

  function handleSaved(saved: Invoice) {
    setInvoices((prev) => {
      const exists = prev.find((inv) => inv.id === saved.id);
      if (exists) return prev.map((inv) => (inv.id === saved.id ? saved : inv));
      return [saved, ...prev];
    });
  }

  function handleEditFromPreview(invoice: Invoice) {
    setPreviewInvoice(null);
    setEditInvoice(invoice);
  }

  return (
    <Box>
      <PageHeader
        subtitle="Create and download invoices for your clients"
        action={(
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            New Invoice
          </Button>
        )}
      />

      <InvoiceSummaryBar invoices={invoices} />

      <InvoiceFiltersBar filters={filters} onChange={setFilters} />

      {filteredInvoices.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body2" color="text.secondary">
            No invoices found — create your first one
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredInvoices.map((invoice) => (
            <Grid key={invoice.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <InvoiceCard
                invoice={invoice}
                onPreview={() => setPreviewInvoice(invoice)}
                onDownload={() => downloadInvoicePdf(invoice)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateInvoiceModal
        open={createOpen}
        onSaved={handleSaved}
        onClose={() => setCreateOpen(false)}
      />

      <CreateInvoiceModal
        open={Boolean(editInvoice)}
        invoice={editInvoice}
        onSaved={handleSaved}
        onClose={() => setEditInvoice(null)}
      />

      <InvoicePreviewModal
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onEdit={handleEditFromPreview}
      />
    </Box>
  );
}
