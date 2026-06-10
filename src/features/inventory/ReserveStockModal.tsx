import { QrCodeScannerOutlined } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { INVENTORY_PRODUCTS } from "./inventory.data";
import type { ReserveStockForm } from "./inventory.types";

type Props = { open: boolean; onClose: () => void };

const EMPTY: ReserveStockForm = {
  productId: "",
  quantity: 0,
  customerRef: "",
  dateNeeded: new Date().toISOString().split("T")[0],
  reservedBy: "",
};

export function ReserveStockModal({ open, onClose }: Props) {
  const [form, setForm] = useState<ReserveStockForm>(EMPTY);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  function set<K extends keyof ReserveStockForm>(k: K, v: ReserveStockForm[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleBarcodeDetected(barcode: string) {
    setScannerOpen(false);
    setScannedBarcode(barcode);
    const match = INVENTORY_PRODUCTS.find((p) => p.barcode === barcode);
    if (match) {
      set("productId", match.productId);
    } else {
      set("productId", "");
    }
  }

  function handleProductChange(productId: string) {
    setScannedBarcode(null);
    set("productId", productId);
  }

  function handleSubmit() {
    // TODO: call inventory API
    console.log("Reserve stock:", form);
    handleClose();
  }

  function handleClose() {
    setForm(EMPTY);
    setScannedBarcode(null);
    onClose();
  }

  const noMatchFound = scannedBarcode !== null && form.productId === "";
  const selectedProduct = INVENTORY_PRODUCTS.find(
    (p) => p.productId === form.productId,
  );

  const isValid =
    form.productId !== "" &&
    form.quantity > 0 &&
    form.customerRef.trim() !== "";

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reserve Stock</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Product"
                value={form.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                fullWidth
                required
                autoFocus
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 2 }}>
                        <Tooltip title="Scan barcode to find product">
                          <IconButton
                            onClick={() => setScannerOpen(true)}
                            edge="end"
                            size="small"
                          >
                            <QrCodeScannerOutlined />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {INVENTORY_PRODUCTS.map((p) => (
                  <MenuItem key={p.productId} value={p.productId}>
                    {p.productName} ({p.serial}) — {p.quantityOnHand} on hand
                  </MenuItem>
                ))}
              </TextField>

              {noMatchFound && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  No product matched barcode <strong>{scannedBarcode}</strong>.
                  Select manually above.
                </Alert>
              )}

              {scannedBarcode && selectedProduct && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Scanned and matched:{" "}
                  <strong>{selectedProduct.productName}</strong>
                </Alert>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quantity to Reserve"
                type="number"
                value={form.quantity || ""}
                onChange={(e) => set("quantity", Number(e.target.value))}
                fullWidth
                required
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date Needed"
                type="date"
                value={form.dateNeeded}
                onChange={(e) => set("dateNeeded", e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Customer Name / Job Reference"
                value={form.customerRef}
                onChange={(e) => set("customerRef", e.target.value)}
                fullWidth
                required
                placeholder="e.g. John Kamau / LC200-007"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Reserved By"
                value={form.reservedBy}
                onChange={(e) => set("reservedBy", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Reserve
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={handleBarcodeDetected}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}
