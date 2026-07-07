import { QrCodeScannerOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { useAuthStore } from "../auth/auth.store";
import { getItemByBarcode, getItems, mapItemToProduct } from "../products/products.api";
import type { Product } from "../products/products.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

function stockStatus(p: Product): { label: string; color: "success" | "warning" | "error" } {
  if (p.stockQuantity === 0) return { label: "Out of Stock", color: "error" };
  if (p.stockQuantity <= p.lowStockThreshold) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
}

export function CheckItemModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
  }, [open]);

  // Text search — debounced, uses /inventory/items?search=
  useEffect(() => {
    if (!open) return;
    if (!storeId) return;

    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Skip debounced search if the query was already handled as a barcode scan
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await getItems(storeId, { search: query });
        setResults(data.map(mapItemToProduct));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, storeId, open]);

  async function handleBarcodeDetected(barcode: string) {
    setQuery(barcode);
    setScannerOpen(false);
    clearTimeout(debounceRef.current);
    if (!storeId) return;

    setLoading(true);
    try {
      const item = await getItemByBarcode(storeId, barcode);
      if (item) {
        setResults([mapItemToProduct(item)]);
      } else {
        // Fall back to general search if exact match fails
        const { data } = await getItems(storeId, { search: barcode });
        setResults(data.map(mapItemToProduct));
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setQuery("");
    setResults([]);
    onClose();
  }

  const showResults = query.trim().length > 0;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Check Item</DialogTitle>

        <DialogContent dividers>
          <TextField
            placeholder="Search by name or barcode…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            size="small"
            autoFocus
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Scan barcode with camera">
                      <IconButton size="small" edge="end" onClick={() => setScannerOpen(true)}>
                        <QrCodeScannerOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />

          {!showResults ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              Type or scan a barcode to search
            </Typography>
          ) : loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : results.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No items match your search
            </Typography>
          ) : (
            <List disablePadding>
              {results.map((p, idx) => {
                const status = stockStatus(p);
                return (
                  <Box key={p.id}>
                    <ListItem disablePadding sx={{ py: 1.5, gap: 1 }}>
                      <ListItemText
                        primary={p.name}
                        secondary={
                          <Box component="span" sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                            <span>Barcode: {p.barcode || "—"}</span>
                            <span>
                              Buying: KSh {p.buyingPrice.toLocaleString()} ·
                              Selling: KSh {p.sellingPrice.toLocaleString()}
                            </span>
                          </Box>
                        }
                        slotProps={{
                          primary: { style: { fontWeight: 500, fontSize: "0.875rem" } },
                          secondary: { style: { fontSize: "0.75rem" } },
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
                        <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {p.stockQuantity.toLocaleString()} on hand
                        </Typography>
                      </Box>
                    </ListItem>
                    {idx < results.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={handleBarcodeDetected}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}