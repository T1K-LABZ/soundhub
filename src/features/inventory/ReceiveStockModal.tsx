import { AddOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { INVENTORY_PRODUCTS } from "./inventory.data";
import type { BatchReceiveForm, StockBatchItem } from "./inventory.types";
import { ReceiveBatchRow } from "./ReceiveBatchRow";

type Props = { open: boolean; onClose: () => void };

function makeEmptyItem(): StockBatchItem {
  return {
    id: crypto.randomUUID(),
    productId: "",
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0,
  };
}

const EMPTY_FORM: BatchReceiveForm = {
  supplier: "",
  dateReceived: new Date().toISOString().split("T")[0],
  receivedBy: "",
  notes: "",
  items: [makeEmptyItem()],
};

export function ReceiveStockModal({ open, onClose }: Props) {
  const [form, setForm] = useState<BatchReceiveForm>(EMPTY_FORM);
  // Which item row triggered the scanner — null when scanner is closed
  const [scanningItemId, setScanningItemId] = useState<string | null>(null);
  const [scanWarning, setScanWarning] = useState<string | null>(null);

  function setHeader<K extends keyof Omit<BatchReceiveForm, "items">>(
    k: K,
    v: BatchReceiveForm[K],
  ) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleItemChange(updated: StockBatchItem) {
    setForm((p) => ({
      ...p,
      items: p.items.map((it) => (it.id === updated.id ? updated : it)),
    }));
  }

  function handleAddItem() {
    setForm((p) => ({ ...p, items: [...p.items, makeEmptyItem()] }));
  }

  function handleRemoveItem(itemId: string) {
    setForm((p) => ({ ...p, items: p.items.filter((it) => it.id !== itemId) }));
  }

  /**
   * Scanner fires for a specific item row (identified by scanningItemId).
   * Like a warehouse gun scanner — you aim it at one item on the shelf,
   * and only that item's details get filled in.
   */
  function handleBarcodeDetected(barcode: string) {
    if (!scanningItemId) return;
    setScanWarning(null);

    const product = INVENTORY_PRODUCTS.find((p) => p.barcode === barcode);
    if (product) {
      setForm((p) => ({
        ...p,
        items: p.items.map((it) =>
          it.id === scanningItemId
            ? {
                ...it,
                productId: product.productId,
                buyingPrice: product.buyingPrice,
                sellingPrice: product.sellingPrice,
              }
            : it,
        ),
      }));
    } else {
      setScanWarning(`No product matched barcode ${barcode}. Select manually.`);
    }

    setScanningItemId(null);
  }

  function handleSubmit() {
    // TODO: call inventory API — each item becomes a separate batch record
    console.log("Receive stock batch:", form);
    handleClose();
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setScanningItemId(null);
    setScanWarning(null);
    onClose();
  }

  const isValid =
    form.supplier.trim() !== "" &&
    form.items.length > 0 &&
    form.items.every(
      (it) =>
        it.productId !== "" &&
        it.quantity > 0 &&
        it.buyingPrice > 0 &&
        it.sellingPrice > 0,
    );

  const totalUnits = form.items.reduce((s, it) => s + (it.quantity || 0), 0);
  const totalValue = form.items.reduce(
    (s, it) => s + (it.quantity || 0) * (it.buyingPrice || 0),
    0,
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Stock (Stock In)</DialogTitle>

        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}
        >
          {/* ── Delivery header ── */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              DELIVERY DETAILS
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Supplier Name"
                  value={form.supplier}
                  onChange={(e) => setHeader("supplier", e.target.value)}
                  fullWidth
                  required
                  autoFocus
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date Received"
                  type="date"
                  value={form.dateReceived}
                  onChange={(e) => setHeader("dateReceived", e.target.value)}
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Received By"
                  value={form.receivedBy}
                  onChange={(e) => setHeader("receivedBy", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => setHeader("notes", e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ── Items list ── */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                ITEMS RECEIVED
              </Typography>
              <Button
                size="small"
                startIcon={<AddOutlined />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>

            {scanWarning && (
              <Alert
                severity="warning"
                sx={{ mb: 1.5 }}
                onClose={() => setScanWarning(null)}
              >
                {scanWarning}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {form.items.map((item, idx) => (
                <ReceiveBatchRow
                  key={item.id}
                  item={item}
                  index={idx}
                  products={INVENTORY_PRODUCTS}
                  canRemove={form.items.length > 1}
                  onScanClick={(id) => setScanningItemId(id)}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Box>
          </Box>

          {/* ── Delivery summary ── */}
          {form.items.some((it) => it.quantity > 0) && (
            <Box
              sx={{
                bgcolor: "action.hover",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                display: "flex",
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Units
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {totalUnits}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Cost Value
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  KSh {totalValue.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Items
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {form.items.length}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Confirm Receipt
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeScannerDialog
        open={scanningItemId !== null}
        onDetected={handleBarcodeDetected}
        onClose={() => setScanningItemId(null)}
      />
    </>
  );
}
