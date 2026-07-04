import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useItemsQuery } from "../inventory/inventory.api";
import { useCreateCounterSale } from "./sales.api";
import { useStaffListQuery } from "../staff/staff.api";
import type { JobProduct, PaymentMethod, PaymentStatus } from "./sales.types";
import { formatKsh } from "./sales.utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

type WalkInForm = {
  customerName: string;
  customerPhone: string;
  products: JobProduct[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  servedBy: string;
  notes: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Mpesa",
  "Card",
  "Bank Transfer",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Unpaid", "Deposit Made"];

const INIT: WalkInForm = {
  customerName: "",
  customerPhone: "",
  products: [],
  paymentStatus: "Paid",
  paymentMethod: "Cash",
  paymentReference: "",
  servedBy: "",
  notes: "",
};

export function WalkInModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: apiProducts = [] } = useItemsQuery(storeId);
  const { data: staffList = [] } = useStaffListQuery(storeId);
  const createSale = useCreateCounterSale();

  const [form, setForm] = useState<WalkInForm>(INIT);

  function set<K extends keyof WalkInForm>(key: K, value: WalkInForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Products ──────────────────────────────────────────────────────────────

  function addProduct() {
    if (apiProducts.length === 0) return;
    const first = apiProducts[0];
    const price = Number(first.sellingPrice) || 0;
    const line: JobProduct = {
      productId: first.id,
      productName: first.name,
      quantity: 1,
      unitPrice: price,
      lineTotal: price,
    };
    set("products", [...form.products, line]);
  }

  function updateProduct(
    idx: number,
    field: keyof JobProduct,
    value: string | number,
  ) {
    const updated = form.products.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p, [field]: value };
      if (field === "productId") {
        const found = apiProducts.find((ip) => ip.id === value);
        if (found) {
          next.productName = found.name;
          next.unitPrice = Number(found.sellingPrice) || 0;
        }
      }
      next.lineTotal = Number(next.quantity) * Number(next.unitPrice);
      return next;
    });
    set("products", updated);
  }

  function removeProduct(idx: number) {
    set(
      "products",
      form.products.filter((_, i) => i !== idx),
    );
  }

  const total = form.products.reduce(
    (s, p) => s + Number(p.lineTotal),
    0,
  );

  // ── Save ──────────────────────────────────────────────────────────────────

  function handleClose() {
    setForm(INIT);
    onClose();
  }

  async function handleSave() {
    if (!storeId) return;
    createSale.mutate(
      {
        storeId,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        products: form.products.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          lineTotal: p.lineTotal,
        })),
        totalAmount: total,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
        paymentReference: form.paymentReference || undefined,
        servedBy: form.servedBy,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Walk-In Purchase</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Customer details */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Customer Name"
              fullWidth
              size="small"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              fullWidth
              size="small"
              value={form.customerPhone}
              onChange={(e) => set("customerPhone", e.target.value)}
              placeholder="0712 345 678"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Products */}
        <Typography variant="subtitle2" mb={1}>
          Products
        </Typography>
        {form.products.map((p, idx) => (
          <Grid
            container
            spacing={1}
            key={idx}
            sx={{ mb: 1 }}
            alignItems="center"
          >
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                select
                size="small"
                fullWidth
                value={p.productId}
                onChange={(e) =>
                  updateProduct(idx, "productId", e.target.value)
                }
              >
                {apiProducts.map((ip) => (
                  <MenuItem key={ip.id} value={ip.id}>
                    {ip.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField
                size="small"
                type="number"
                label="Qty"
                fullWidth
                value={p.quantity}
                onChange={(e) =>
                  updateProduct(idx, "quantity", Number(e.target.value))
                }
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                {formatKsh(Number(p.lineTotal) || 0)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 2, sm: 1 }}>
              <IconButton size="small" onClick={() => removeProduct(idx)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          size="small"
          startIcon={<AddOutlined />}
          onClick={addProduct}
          sx={{ mb: 2 }}
        >
          Add Product
        </Button>

        {/* Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1.5,
            bgcolor: "background.default",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            Total
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {formatKsh(total)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Payment + served by */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="Payment Status"
              fullWidth
              size="small"
              value={form.paymentStatus}
              onChange={(e) =>
                set("paymentStatus", e.target.value as PaymentStatus)
              }
            >
              {PAYMENT_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="Payment Method"
              fullWidth
              size="small"
              value={form.paymentMethod}
              onChange={(e) =>
                set("paymentMethod", e.target.value as PaymentMethod)
              }
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="Served By"
              fullWidth
              size="small"
              value={form.servedBy}
              onChange={(e) => set("servedBy", e.target.value)}
              required
            >
              {staffList.map((s) => (
                <MenuItem key={s.id} value={s.user.fullName}>
                  {s.user.fullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Payment Reference (optional)"
              fullWidth
              size="small"
              value={form.paymentReference}
              onChange={(e) => set("paymentReference", e.target.value)}
              placeholder="Mpesa ref, cheque no, etc."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Notes (optional)"
              fullWidth
              size="small"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any additional notes"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !form.customerName || form.products.length === 0 || !form.servedBy || createSale.isPending
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
