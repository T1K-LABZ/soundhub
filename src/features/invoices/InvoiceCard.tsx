import { DownloadOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Invoice } from "./invoice.types";
import { formatKsh, getInvoiceTotal } from "./invoice.utils";

type Props = {
  invoice: Invoice;
  onPreview: () => void;
  onDownload: () => void;
};

export function InvoiceCard({ invoice, onPreview, onDownload }: Props) {
  const total = getInvoiceTotal(invoice);
  const itemCount = invoice.lineItems.length;

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 1 },
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      onClick={onPreview}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header: Invoice # + Total */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              {invoice.invoiceNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {invoice.date}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {formatKsh(total)}
          </Typography>
        </Box>

        {/* Client info */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" fontWeight={500}>
            {invoice.clientName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {invoice.clientEmail}
          </Typography>
        </Box>

        {/* Items preview */}
        <Box sx={{ mb: 1.5 }}>
          <Chip
            label={`${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 22 }}
          />
        </Box>

        {/* Line items summary */}
        <Box sx={{ bgcolor: "background.default", borderRadius: 1, p: 1.5, mb: 1.5, flex: 1 }}>
          {invoice.lineItems.slice(0, 2).map((item, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                {item.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                x{item.quantity}
              </Typography>
            </Box>
          ))}
          {itemCount > 2 && (
            <Typography variant="caption" color="text.secondary">
              +{itemCount - 2} more items
            </Typography>
          )}
        </Box>

        {/* Notes */}
        {invoice.notes && (
          <Typography variant="caption" color="text.secondary" display="block" mb={1.5} noWrap>
            Note: {invoice.notes}
          </Typography>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mt: "auto" }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View">
            <IconButton size="small" onClick={onPreview}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton size="small" color="primary" onClick={onDownload}>
              <DownloadOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
