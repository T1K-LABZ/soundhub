import { AddOutlined } from "@mui/icons-material";
import {
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
import { useAuthStore } from "../auth/auth.store";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { useItemsQuery, useReceiveStock } from "./inventory.api";
import type { CreateIncomingBatchItem, CreateIncomingForm } from "./inventory.types";
import { IncomingBatchRow } from "./IncomingBatchRow";

type Props = { open: boolean; onClose: () => void };

function makeEmptyItem(): CreateIncomingBatchItem {
  return {
    id: crypto.randomUUID(),
    productId: "",
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    status: "IN_TRANSIT",
  };
}

const EMPTY_FORM: CreateIncomingForm = {
  supplier: "",
  expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  trackingRef: "",
  notes: "",
  createdBy: "",
  items: [makeEmptyItem()],
};

export function CreateIncomingModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: products = [] } = useItemsQuery(storeId);
  const receiveStock = useReceiveStock();
  const [form, setForm] = useState<CreateIncomingForm>(EMPTY_FORM);
  const [scanningItemId, setScanningItemId] = useState<string | null>(null);

  function setHeader<K extends keyof Omit<CreateIncomingForm, "items">>(
    k: K,
    v: CreateIncomingForm[K],
  ) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleItemChange(updated: CreateIncomingBatchItem) {
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

  function handleBarcodeDetected(barcode: string) {
    if (!scanningItemId) return;
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      setForm((p) => ({
        ...p,
        items: p.items.map((it) =>
          it.id === scanningItemId ? { ...it, productId: product.id } : it,
        ),
      }));
    }
    setScanningItemId(null);
  }

  function handleSubmit() {
    receiveStock.mutate(
      {
        storeId,
        supplier: form.supplier,
        expectedDate: form.expectedDate,
        trackingRef: form.trackingRef,
        notes: form.notes,
        createdBy: form.createdBy,
        items: form.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          buyingPrice: it.buyingPrice,
          sellingPrice: it.sellingPrice,
          status: it.status,
        })),
      },
      { onSuccess: handleClose },
    );
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setScanningItemId(null);
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
  const totalCostValue = form.items.reduce(
    (s, it) => s + (it.quantity || 0) * (it.buyingPrice || 0),
    0,
  );
  const totalRetailValue = form.items.reduce(
    (s, it) => s + (it.quantity || 0) * (it.sellingPrice || 0),
    0,
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Incoming Stock</DialogTitle>

        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}
        >
          {/* Delivery header */}
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
                  label="Expected Date"
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) => setHeader("expectedDate", e.target.value)}
                  fullWidth
                  required
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tracking / PO Number"
                  value={form.trackingRef}
                  onChange={(e) => setHeader("trackingRef", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g. PO-2026-0090"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Created By"
                  value={form.createdBy}
                  onChange={(e) => setHeader("createdBy", e.target.value)}
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

          {/* Items list */}
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
                ITEMS INCOMING
              </Typography>
              <Button
                size="small"
                startIcon={<AddOutlined />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {form.items.map((item, idx) => (
                <IncomingBatchRow
                  key={item.id}
                  item={item}
                  index={idx}
                  products={products}
                  canRemove={form.items.length > 1}
                  onScanClick={(id) => setScanningItemId(id)}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Box>
          </Box>

          {/* Delivery summary */}
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
                <Typography variant="caption" color="text.secondary">Total Units</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{totalUnits.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Cost Value</Typography>
                <Typography variant="subtitle2" fontWeight={700}>KSh {totalCostValue.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Retail Value</Typography>
                <Typography variant="subtitle2" fontWeight={700}>KSh {totalRetailValue.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Items</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{form.items.length.toLocaleString()}</Typography>
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
            Create Incoming Record
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
