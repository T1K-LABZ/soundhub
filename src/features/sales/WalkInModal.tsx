import { DeleteOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useProductSearchQuery } from "../inventory/inventory.api";
import { useCreateCounterSale } from "./sales.api";
import { useStaffListQuery } from "../staff/staff.api";
import type { InventoryItemResponse } from "../products/products.types";
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
const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Unpaid"];

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
  const { data: staffList = [] } = useStaffListQuery(storeId);
  const createSale = useCreateCounterSale();

  const [form, setForm] = useState<WalkInForm>(INIT);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: searchResults = [], isFetching: searchLoading } =
    useProductSearchQuery(storeId, debouncedSearch);

  function set<K extends keyof WalkInForm>(key: K, value: WalkInForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Products ──────────────────────────────────────────────────────────────

  function selectProduct(item: InventoryItemResponse) {
    const alreadySelected = form.products.find((p) => p.productId === item.id);
    if (alreadySelected) return;
    const price = Number(item.sellingPrice) || 0;
    const line: JobProduct = {
      productId: item.id,
      productName: item.name,
      quantity: 1,
      unitPrice: price,
      lineTotal: price,
      photoUrl: item.photoUrl,
    };
    set("products", [...form.products, line]);
    setSearchInput("");
    setDebouncedSearch("");
  }

  function updateProductQty(idx: number, qty: number) {
    const updated = form.products.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p, quantity: qty, lineTotal: qty * p.unitPrice };
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
    setSearchInput("");
    setDebouncedSearch("");
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
        <Typography variant="subtitle2" mb={1} fontWeight={800}>
          Products
        </Typography>

        {/* Product search */}
        <TextField
          size="small"
          placeholder="Search products by name..."
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: searchLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{ mb: 1.5 }}
        />

        {/* Search results */}
        {debouncedSearch && (
          <Box
            sx={{
              maxHeight: 200,
              overflow: "auto",
              mb: 2,
              border: 1,
              borderColor: "rgba(31, 41, 51, 0.08)",
              borderRadius: 1,
            }}
          >
            {searchResults.length === 0 && !searchLoading ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                No products found
              </Typography>
            ) : (
              searchResults.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => selectProduct(item)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.25,
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": { bgcolor: "rgba(31, 41, 51, 0.04)" },
                    borderBottom: 1,
                    borderColor: "rgba(31, 41, 51, 0.06)",
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <Avatar
                    src={item.photoUrl}
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 44, height: 44, bgcolor: "rgba(31, 41, 51, 0.08)" }}
                  >
                    {item.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {item.itemsInStock}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700} color="primary" sx={{ whiteSpace: "nowrap" }}>
                    {formatKsh(Number(item.sellingPrice))}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        )}

        {/* Selected products */}
        {form.products.length > 0 && (
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 0.5, display: "block" }}>
            Selected Products ({form.products.length})
          </Typography>
        )}
        {form.products.map((p, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1.25,
              p: 1.25,
              border: 1,
              borderColor: "rgba(31, 41, 51, 0.08)",
              borderRadius: 1,
              bgcolor: "rgba(31, 41, 51, 0.03)",
            }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid size={{ xs: 12, sm: 5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    src={p.photoUrl}
                    alt={p.productName}
                    variant="rounded"
                    sx={{ width: 36, height: 36, bgcolor: "rgba(31, 41, 51, 0.08)", flexShrink: 0 }}
                  >
                    {p.productName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {p.productName}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4, sm: 2 }}>
                <TextField
                  size="small"
                  type="number"
                  label="Qty"
                  fullWidth
                  value={p.quantity}
                  onChange={(e) => updateProductQty(idx, Number(e.target.value))}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
              </Grid>
              <Grid size={{ xs: 4, sm: 3 }}>
                <Typography variant="body2" fontWeight={800}>
                  {formatKsh(Number(p.lineTotal) || 0)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 2, sm: 1 }} sx={{ textAlign: "right" }}>
                <IconButton size="small" onClick={() => removeProduct(idx)}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        {form.products.length === 0 && !debouncedSearch && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
            Search for a product above to add it to this sale
          </Typography>
        )}

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
