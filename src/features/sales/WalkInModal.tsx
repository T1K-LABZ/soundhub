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
import { INVENTORY_PRODUCTS } from "../inventory/inventory.data";
import type { JobProduct, PaymentMethod, PaymentStatus } from "./sales.types";
import { formatKsh } from "./sales.utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: WalkInData) => void;
};

type WalkInData = {
  customerName: string;
  customerPhone: string;
  products: JobProduct[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  servedBy: string;
};

const STAFF = ["Brian", "Kevin", "James", "Mercy"];
const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Mpesa",
  "Card",
  "Bank Transfer",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Unpaid", "Deposit Made"];

const INIT: WalkInData = {
  customerName: "",
  customerPhone: "",
  products: [],
  paymentStatus: "Paid",
  paymentMethod: "Cash",
  servedBy: "",
};

export function WalkInModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<WalkInData>(INIT);

  function set<K extends keyof WalkInData>(key: K, value: WalkInData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addProduct() {
    const first = INVENTORY_PRODUCTS[0];
    const line: JobProduct = {
      productId: first.productId,
      productName: first.productName,
      quantity: 1,
      unitPrice: first.sellingPrice,
      lineTotal: first.sellingPrice,
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
        const found = INVENTORY_PRODUCTS.find((ip) => ip.productId === value);
        if (found) {
          next.productName = found.productName;
          next.unitPrice = found.sellingPrice;
        }
      }
      next.lineTotal = next.quantity * next.unitPrice;
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

  const total = form.products.reduce((s, p) => s + p.lineTotal, 0);

  function handleClose() {
    setForm(INIT);
    onClose();
  }

  function handleSave() {
    onSave?.(form);
    handleClose();
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
                {INVENTORY_PRODUCTS.map((ip) => (
                  <MenuItem key={ip.productId} value={ip.productId}>
                    {ip.productName}
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
                {formatKsh(p.lineTotal)}
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
              {STAFF.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !form.customerName || form.products.length === 0 || !form.servedBy
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
