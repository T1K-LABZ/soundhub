import { AddAPhotoOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { BarcodeField } from "./BarcodeField";
import type { CreateProductPayload, ProductFormValues } from "./products.types";

const EMPTY_FORM: ProductFormValues = {
  name: "",
  category: "",
  barcode: "",
  buyingPrice: 0,
  sellingPrice: 0,
  startingStock: 0,
  lowStockThreshold: 5,
  createdDate: new Date().toISOString().split("T")[0], // default to today
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddProductModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId ?? "");
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);

  function set<K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    const payload: CreateProductPayload = {
      ...form,
      storeId,
      serial: form.barcode, // barcode doubles as serial
      createdDate: new Date(form.createdDate).toISOString(),
      // photoUrl will be added after ImageKit upload
      photoUrl: "",
    };
    // TODO: call products API with payload
    console.log("Create product payload:", payload);
    handleClose();
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onClose();
  }

  const isValid =
    form.name.trim() !== "" &&
    form.category.trim() !== "" &&
    form.buyingPrice > 0 &&
    form.sellingPrice > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Product</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          {/* Photo placeholder — ImageKit integration coming later */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 3,
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <AddAPhotoOutlined
                sx={{ color: "text.secondary", fontSize: 32 }}
              />
              <Typography variant="body2" color="text.secondary">
                Take photo or upload — ImageKit coming soon
              </Typography>
            </Box>
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Product Name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              fullWidth
              required
              autoFocus
            />
          </Grid>

          {/* Category — free text until Categories screen is built */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              fullWidth
              required
              placeholder="e.g. Spirits"
              helperText="Categories screen coming soon"
            />
          </Grid>

          {/* Barcode */}
          <Grid size={{ xs: 12 }}>
            <BarcodeField
              value={form.barcode}
              onChange={(v) => set("barcode", v)}
            />
          </Grid>

          {/* Buying price */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Buying Price (KSh)"
              type="number"
              value={form.buyingPrice || ""}
              onChange={(e) => set("buyingPrice", Number(e.target.value))}
              fullWidth
              required
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>

          {/* Selling price */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Selling Price (KSh)"
              type="number"
              value={form.sellingPrice || ""}
              onChange={(e) => set("sellingPrice", Number(e.target.value))}
              fullWidth
              required
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>

          {/* Starting stock */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Starting Stock"
              type="number"
              value={form.startingStock || ""}
              onChange={(e) => set("startingStock", Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>

          {/* Low stock threshold */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Low Stock Alert At"
              type="number"
              value={form.lowStockThreshold || ""}
              onChange={(e) => set("lowStockThreshold", Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>

          {/* Created date */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Created Date"
              type="date"
              value={form.createdDate}
              onChange={(e) => set("createdDate", e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
}
