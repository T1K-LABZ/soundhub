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
import type { WriteOffForm } from "./inventory.types";

type Props = { open: boolean; onClose: () => void };

const ACTIONS: WriteOffForm["actionTaken"][] = [
  "Written Off",
  "Return to Supplier",
  "Repair",
  "Warranty",
];

const EMPTY: WriteOffForm = {
  productId: "",
  quantity: 0,
  faultDescription: "",
  actionTaken: "Written Off",
  date: new Date().toISOString().split("T")[0],
  loggedBy: "",
};

export function WriteOffModal({ open, onClose }: Props) {
  const [form, setForm] = useState<WriteOffForm>(EMPTY);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  function set<K extends keyof WriteOffForm>(k: K, v: WriteOffForm[K]) {
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
    console.log("Write off:", form);
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
    form.faultDescription.trim() !== "";

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write Off / Damaged Stock</DialogTitle>
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
                    {p.productName} ({p.serial})
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
                label="Quantity Affected"
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
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Fault Description"
                value={form.faultDescription}
                onChange={(e) => set("faultDescription", e.target.value)}
                fullWidth
                required
                multiline
                rows={2}
                placeholder="Describe the fault or damage…"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Action Taken"
                value={form.actionTaken}
                onChange={(e) =>
                  set(
                    "actionTaken",
                    e.target.value as WriteOffForm["actionTaken"],
                  )
                }
                fullWidth
              >
                {ACTIONS.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Logged By"
                value={form.loggedBy}
                onChange={(e) => set("loggedBy", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Log Write-Off
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
