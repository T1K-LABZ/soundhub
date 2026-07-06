import { QrCodeScannerOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
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
import { useState } from "react";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { INVENTORY_PRODUCTS } from "./inventory.data";
import type { InventoryProduct } from "./inventory.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

function stockStatus(item: InventoryProduct): {
  label: string;
  color: "success" | "warning" | "error";
} {
  if (item.quantityOnHand === 0)
    return { label: "Out of Stock", color: "error" };
  if (item.quantityOnHand <= item.reorderPoint)
    return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
}

export function CheckItemModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  // Match against both name and barcode so scanning works seamlessly
  const filtered = INVENTORY_PRODUCTS.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.productName.toLowerCase().includes(q) || item.barcode.includes(q)
    );
  });

  function handleBarcodeDetected(barcode: string) {
    setQuery(barcode);
    setScannerOpen(false);
  }

  function handleClose() {
    setQuery("");
    onClose();
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Check Item</DialogTitle>

        <DialogContent dividers>
          {/* Single search bar — name or barcode, with camera scan button */}
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
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setScannerOpen(true)}
                      >
                        <QrCodeScannerOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Results */}
          {filtered.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 3 }}
            >
              No items match your search
            </Typography>
          ) : (
            <List disablePadding>
              {filtered.map((item, idx) => {
                const status = stockStatus(item);
                return (
                  <Box key={item.productId}>
                    <ListItem disablePadding sx={{ py: 1.5, gap: 1 }}>
                      <ListItemText
                        primary={item.productName}
                        secondary={
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.25,
                            }}
                          >
                            <span>Barcode: {item.barcode}</span>
                            <span>
                              Buying: KSh {item.buyingPrice.toLocaleString()} ·
                              Selling: KSh {item.sellingPrice.toLocaleString()}
                            </span>
                          </Box>
                        }
                        slotProps={{
                          primary: {
                            style: { fontWeight: 500, fontSize: "0.875rem" },
                          },
                          secondary: { style: { fontSize: "0.75rem" } },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.quantityOnHand.toLocaleString()} on hand
                        </Typography>
                      </Box>
                    </ListItem>
                    {idx < filtered.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Camera scanner — opens on top of the modal */}
      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={handleBarcodeDetected}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}
