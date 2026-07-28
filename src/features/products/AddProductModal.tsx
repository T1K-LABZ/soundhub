import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiClient } from "../../lib/axios";
import type { ApiResponse } from "../auth/auth.types";
import { useAuthStore } from "../auth/auth.store";
import { BarcodeField } from "./BarcodeField";
import { PhotoUpload } from "./PhotoUpload";
import { createProduct, getCategories, updateProduct } from "./products.api";
import type { CreateProductPayload, Product, ProductFormValues } from "./products.types";

const EMPTY_FORM: ProductFormValues = {
  name: "", category: "Speaker", description: "", barcode: "",
  buyingPrice: 0, sellingPrice: 0, startingStock: 0,
  lowStockThreshold: 5, createdDate: new Date().toISOString().split("T")[0],
};

type Props = { open: boolean; onClose: () => void; productId?: string; product?: Product | null };
type R2AuthResponse = { uploadUrl: string; publicUrl: string };

export function AddProductModal({ open, onClose, productId, product }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId ?? "");
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const isEditMode = Boolean(productId);

  useEffect(() => {
    if (open && storeId) {
      getCategories(storeId).then(({ data }) => {
        setCategories(data.map((c) => c.name));
      }).catch(() => {});
    }
  }, [open, storeId]);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setFile(null);
      setPreview(null);
      setExistingPhotoUrl("");
      return;
    }

    // Prefill from the product prop if available
    if (product) {
      setForm({
        name: product.name,
        category: product.category || "Speaker",
        description: product.description || "",
        barcode: product.barcode || "",
        buyingPrice: product.buyingPrice || 0,
        sellingPrice: product.sellingPrice || 0,
        startingStock: product.stockQuantity || 0,
        lowStockThreshold: product.lowStockThreshold || 5,
        createdDate: product.createdDate || new Date().toISOString().split("T")[0],
      });
      if (product.photoUrl) {
        setExistingPhotoUrl(product.photoUrl);
        setPreview(product.photoUrl);
      }
      return;
    }

    // Fallback: fetch if only productId provided (no product data)
    if (!productId || !storeId) return;
    setForm(EMPTY_FORM);
  }, [open, productId, storeId, product]);

  function set<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setExistingPhotoUrl("");
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
    setExistingPhotoUrl("");
  }

  async function handleSubmit() {
    setUploading(true);
    let photoUrl = existingPhotoUrl;
    try {
      if (file) {
        const authRes = await apiClient.get<ApiResponse<R2AuthResponse>>(
          `/uploads/r2-auth?contentType=${encodeURIComponent(file.type)}`,
        );
        const { uploadUrl, publicUrl } = authRes.data.data;
        await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        photoUrl = publicUrl;
      }
      const payload = {
        ...form, photoUrl, storeId, serial: form.barcode,
        createdDate: new Date(form.createdDate).toISOString(),
      };
      if (isEditMode && productId) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
    } catch {
      setUploading(false);
      return;
    }
    handleClose();
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setExistingPhotoUrl("");
    setUploading(false);
    onClose();
  }

  const isValid = form.name.trim() !== "" && form.category.trim() !== ""
    && form.buyingPrice > 0 && form.sellingPrice > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <PhotoUpload preview={preview} onFileChange={handleFileChange} onRemove={handleRemoveFile} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Product Name" value={form.name} onChange={(e) => set("name", e.target.value)} fullWidth required autoFocus />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField select label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} fullWidth required>
                {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} fullWidth multiline rows={3} placeholder="Product details, specs, features..." />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <BarcodeField value={form.barcode} onChange={(v) => set("barcode", v)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Buying Price (KSh)" type="number" value={form.buyingPrice || ""} onChange={(e) => set("buyingPrice", Number(e.target.value))} fullWidth required slotProps={{ htmlInput: { min: 0 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Selling Price (KSh)" type="number" value={form.sellingPrice || ""} onChange={(e) => set("sellingPrice", Number(e.target.value))} fullWidth required slotProps={{ htmlInput: { min: 0 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Starting Stock" type="number" value={form.startingStock || ""} onChange={(e) => set("startingStock", Number(e.target.value))} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Low Stock Alert At" type="number" value={form.lowStockThreshold || ""} onChange={(e) => set("lowStockThreshold", Number(e.target.value))} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Created Date" type="date" value={form.createdDate} onChange={(e) => set("createdDate", e.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
          </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid || uploading}>
          {uploading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
          {uploading ? "Saving..." : isEditMode ? "Save Changes" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
