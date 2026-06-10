import { DownloadOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Invoice } from "./invoice.types";
import {
  downloadInvoicePdf,
  formatKsh,
  getInvoiceTotal,
} from "./invoice.utils";

type Props = {
  invoice: Invoice | null;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
};

export function InvoicePreviewModal({ invoice, onClose, onEdit }: Props) {
  if (!invoice) return null;

  const total = getInvoiceTotal(invoice);

  return (
    <Dialog open={Boolean(invoice)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Invoice Preview
        <Typography variant="body2" color="text.secondary">
          {invoice.invoiceNumber}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Header row — branding left, invoice meta right */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography variant="h5" color="primary" fontWeight={700}>
              SoundHub
            </Typography>
            <Typography variant="caption" color="text.secondary">
              soundhub.co.ke · info@soundhub.co.ke
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" fontWeight={700}>
              INVOICE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.invoiceNumber}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bill to / Date */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              BILL TO
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
              {invoice.clientName}
            </Typography>
            {invoice.clientEmail && (
              <Typography variant="body2" color="text.secondary">
                {invoice.clientEmail}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              DATE
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {invoice.date}
            </Typography>
          </Box>
        </Box>

        {/* Line items table */}
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Description
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: 700 }}
              >
                Qty
              </TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>
                Unit Price
              </TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.lineItems.map((item, idx) => (
              <TableRow
                key={idx}
                sx={{
                  bgcolor:
                    idx % 2 === 0 ? "background.default" : "background.paper",
                }}
              >
                <TableCell>{item.description}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{formatKsh(item.unitPrice)}</TableCell>
                <TableCell align="right">
                  {formatKsh(item.quantity * item.unitPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box sx={{ minWidth: 200 }}>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                {formatKsh(total)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notes */}
        {invoice.notes && (
          <Box
            sx={{ mt: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              NOTES
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {invoice.notes}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="outlined"
          startIcon={<EditOutlined />}
          onClick={() => onEdit(invoice)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadOutlined />}
          onClick={() => downloadInvoicePdf(invoice)}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
