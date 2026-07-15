import { AddOutlined, WarningAmberOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";
import { useItemsQuery, useReceiveStock, useUpdateBatch } from "./inventory.api";
import { useStaffListQuery } from "../staff/staff.api";
import type { BatchItem } from "./inventory.api";
import type { CreateIncomingBatchItem, CreateIncomingForm } from "./inventory.types";
import { IncomingBatchRow } from "./IncomingBatchRow";

type Props = { open: boolean; onClose: () => void; editingBatch?: BatchItem | null };

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

function batchToForm(batch: BatchItem): CreateIncomingForm {
  return {
    supplier: batch.supplier || "",
    expectedDate: batch.expectedDate?.split("T")[0] || "",
    trackingRef: batch.trackingRef || "",
    notes: batch.notes || "",
    createdBy: "",
    items: [
      {
        id: crypto.randomUUID(),
        productId: batch.productId,
        productName: batch.product?.name || "",
        quantity: batch.quantityReceived,
        buyingPrice: Number(batch.buyingPrice) || 0,
        sellingPrice: Number(batch.sellingPrice) || 0,
        status: batch.status,
      },
    ],
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

export function CreateIncomingModal({ open, onClose, editingBatch }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: products = [] } = useItemsQuery(storeId);
  const { data: staffList = [] } = useStaffListQuery(storeId);
  const receiveStock = useReceiveStock();
  const updateBatch = useUpdateBatch(editingBatch?.id ?? "noop");
  const isEditing = !!editingBatch;
  const isPending = receiveStock.isPending || updateBatch.isPending;
  const [form, setForm] = useState<CreateIncomingForm>(EMPTY_FORM);
  const [scanningItemId, setScanningItemId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const latestItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingBatch) {
      setForm(batchToForm(editingBatch));
    } else {
      setForm(EMPTY_FORM);
    }
    setScanningItemId(null);
  }, [editingBatch, open]);

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

  const latestItemIdRef = useRef<string | null>(null);

  function handleAddItem() {
    const newItem = makeEmptyItem();
    latestItemIdRef.current = newItem.id;
    setForm((p) => ({ ...p, items: [...p.items, newItem] }));
  }

  useEffect(() => {
    if (latestItemIdRef.current) {
      const el = document.getElementById(`batch-item-${latestItemIdRef.current}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        latestItemIdRef.current = null;
      }
    }
  }, [form.items.length]);

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
          it.id === scanningItemId
            ? {
                ...it,
                productId: product.id,
                productName: product.name,
                buyingPrice: product.costPrice ?? 0,
                sellingPrice: product.sellingPrice ?? 0,
              }
            : it,
        ),
      }));
    }
    setScanningItemId(null);
  }

  function handleSubmit() {
    const toReceiveItemPayload = (it: CreateIncomingBatchItem) => ({
      productId: it.productId,
      quantity: it.quantity,
      buyingPrice: it.buyingPrice,
      sellingPrice: it.sellingPrice,
      status: it.status,
    });

    if (isEditing && editingBatch) {
      const [item] = form.items;

      void (async () => {
        try {
          await updateBatch.mutateAsync({
            storeId,
            productId: item.productId,
            supplier: form.supplier,
            expectedDate: form.expectedDate,
            trackingRef: form.trackingRef,
            notes: form.notes,
            quantity: item.quantity,
            status: item.status,
            buyingPrice: item.buyingPrice,
            sellingPrice: item.sellingPrice,
            items: form.items.map(toReceiveItemPayload),
          });

          handleClose();
        } catch {
          // React Query keeps the mutation error state for the UI/devtools.
        }
      })();
    } else {
      receiveStock.mutate(
        {
          storeId,
          supplier: form.supplier,
          expectedDate: form.expectedDate,
          trackingRef: form.trackingRef,
          notes: form.notes,
          createdBy: form.createdBy,
          items: form.items.map(toReceiveItemPayload),
        },
        { onSuccess: handleClose },
      );
    }
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
      <Dialog open={open} onClose={isPending ? undefined : handleClose} maxWidth="sm" fullWidth>
        {isPending && <LinearProgress />}
        <DialogTitle>{isEditing ? "Edit Incoming Stock" : "Create Incoming Stock"}</DialogTitle>

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
                  select
                  label="Created By"
                  value={form.createdBy}
                  onChange={(e) => setHeader("createdBy", e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">
                    <em>Select staff</em>
                  </MenuItem>
                  {staffList.map((s) => (
                    <MenuItem key={s.id} value={s.user.fullName}>
                      {s.user.fullName}
                    </MenuItem>
                  ))}
                </TextField>
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
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
                py: 1,
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
                <Box key={item.id} id={`batch-item-${item.id}`} ref={item.id === latestItemIdRef.current ? latestItemRef : undefined}>
                  <IncomingBatchRow
                    item={item}
                    index={idx}
                    products={products}
                    storeId={storeId}
                    canRemove={form.items.length > 1}
                    onScanClick={(id) => setScanningItemId(id)}
                    onChange={handleItemChange}
                    onRemove={handleRemoveItem}
                  />
                </Box>
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
          <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
          <Button
            variant="contained"
            onClick={isEditing ? handleSubmit : () => setConfirmOpen(true)}
            disabled={!isValid || isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isPending
              ? (isEditing ? "Saving…" : "Creating…")
              : (isEditing ? "Save Changes" : "Create Incoming Record")}
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeScannerDialog
        open={scanningItemId !== null}
        onDetected={handleBarcodeDetected}
        onClose={() => setScanningItemId(null)}
      />

      {/* Confirm create dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberOutlined color="warning" />
          Confirm Create Incoming Stock
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1}>
            You are about to create an incoming stock record with the following details:
          </Typography>
          <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 1.5, mb: 1.5, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Supplier</Typography>
              <Typography variant="body2" fontWeight={600}>{form.supplier}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Expected Date</Typography>
              <Typography variant="body2" fontWeight={600}>{form.expectedDate}</Typography>
            </Box>
            {form.trackingRef && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Tracking Ref</Typography>
                <Typography variant="body2" fontWeight={600}>{form.trackingRef}</Typography>
              </Box>
            )}
            {form.createdBy && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Created By</Typography>
                <Typography variant="body2" fontWeight={600}>{form.createdBy}</Typography>
              </Box>
            )}
          </Box>
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            {form.items.length} item{form.items.length > 1 ? "s" : ""} — {totalUnits.toLocaleString()} units total
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Cost: KSh {totalCostValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Retail: KSh {totalRetailValue.toLocaleString()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Go Back</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => { setConfirmOpen(false); handleSubmit(); }}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isPending ? "Creating…" : "Yes, Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
