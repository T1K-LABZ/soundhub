import { AddOutlined, DownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { MOCK_INVOICES } from "./invoice.data";
import type { Invoice } from "./invoice.types";
import {
  downloadInvoicePdf,
  formatKsh,
  getInvoiceTotal,
} from "./invoice.utils";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { InvoicePreviewModal } from "./InvoicePreviewModal";

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

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
        title="Invoices"
        subtitle="Create and download invoices for your clients"
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            New Invoice
          </Button>
        }
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No invoices yet — create your first one
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  hover
                  onClick={() => setPreviewInvoice(invoice)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {invoice.invoiceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {invoice.clientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invoice.clientEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${invoice.lineItems.length} item${invoice.lineItems.length !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary"
                    >
                      {formatKsh(getInvoiceTotal(invoice))}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Download PDF">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadInvoicePdf(invoice);
                        }}
                      >
                        <DownloadOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create new invoice */}
      <CreateInvoiceModal
        open={createOpen}
        onSaved={handleSaved}
        onClose={() => setCreateOpen(false)}
      />

      {/* Edit existing invoice */}
      <CreateInvoiceModal
        open={Boolean(editInvoice)}
        invoice={editInvoice}
        onSaved={handleSaved}
        onClose={() => setEditInvoice(null)}
      />

      {/* Preview — exposes Edit button which transitions to edit modal */}
      <InvoicePreviewModal
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onEdit={handleEditFromPreview}
      />
    </Box>
  );
}
