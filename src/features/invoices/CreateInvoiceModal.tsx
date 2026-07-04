import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useItemsQuery } from "../inventory/inventory.api";
import type { InventoryItemResponse } from "../products/products.types";
import { formatKsh, getInvoiceTotal } from "./invoice.utils";
import type {
  Invoice,
  InvoiceFormValues,
  InvoiceLineItem,
} from "./invoice.types";

type Props = {
  open: boolean;
  invoice?: Invoice | null;
  onSaved: (invoice: Invoice) => void;
  onClose: () => void;
};

const EMPTY_LINE: InvoiceLineItem = {
  productId: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
};

const EMPTY_FORM: InvoiceFormValues = {
  clientName: "",
  clientPhone: "",
  date: new Date().toISOString().split("T")[0],
  lineItems: [{ ...EMPTY_LINE }],
  notes: "",
};

function invoiceToForm(invoice: Invoice): InvoiceFormValues {
  return {
    clientName: invoice.clientName,
    clientPhone: invoice.clientPhone,
    date: invoice.date,
    lineItems: invoice.lineItems.map((l) => ({ ...l })),
    notes: invoice.notes,
  };
}

export function CreateInvoiceModal({ open, invoice, onSaved, onClose }: Props) {
  const isEditing = Boolean(invoice);
  const [form, setForm] = useState<InvoiceFormValues>(EMPTY_FORM);
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: products = [] } = useItemsQuery(storeId);

  useEffect(() => {
    if (open) {
      setForm(invoice ? invoiceToForm(invoice) : EMPTY_FORM);
    }
  }, [open, invoice]);

  function setField<K extends keyof InvoiceFormValues>(
    key: K,
    value: InvoiceFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateLineItem(
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number,
  ) {
    setForm((prev) => {
      const updated = [...prev.lineItems];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, lineItems: updated };
    });
  }

  function handleProductSelect(index: number, product: InventoryItemResponse | null) {
    if (!product) return;
    setForm((prev) => {
      const updated = [...prev.lineItems];
      updated[index] = {
        ...updated[index],
        productId: product.id,
        description: product.name,
        unitPrice: Number(product.sellingPrice),
      };
      return { ...prev, lineItems: updated };
    });
  }

  function addLine() {
    setForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...EMPTY_LINE }],
    }));
  }

  function removeLine(index: number) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit() {
    const saved: Invoice =
      isEditing && invoice
        ? { ...invoice, ...form }
        : {
            ...form,
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-${String(Date.now()).slice(-4)}`,
          };

    onSaved(saved);
    onClose();
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onClose();
  }

  const draftTotal = getInvoiceTotal({ ...form, id: "", invoiceNumber: "" });

  const isValid =
    form.clientName.trim() !== "" &&
    form.lineItems.length > 0 &&
    form.lineItems.every(
      (l) => l.productId !== "" && l.quantity > 0 && l.unitPrice > 0,
    );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? "Edit Invoice" : "Create Invoice"}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Client Name"
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
              fullWidth
              required
              autoFocus
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Client Phone"
              type="tel"
              value={form.clientPhone}
              onChange={(e) => setField("clientPhone", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Invoice Date"
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
          Items
        </Typography>

        {form.lineItems.map((line, idx) => (
          <Box key={idx} sx={{ mb: 1.5 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, sm: 5 }}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(opt) => opt.name}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  value={
                    products.find((p) => p.id === line.productId) ?? null
                  }
                  onChange={(_, val) => handleProductSelect(idx, val)}
                  renderInput={(params) => (
                    <TextField {...params} label="Product" size="small" required />
                  )}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 5, sm: 2 }}>
                <TextField
                  label="Qty"
                  type="number"
                  value={line.quantity}
                  onChange={(e) =>
                    updateLineItem(idx, "quantity", Number(e.target.value))
                  }
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { min: 1 } }}
                />
              </Grid>
              <Grid size={{ xs: 5, sm: 3 }}>
                <TextField
                  label="Unit Price (KSh)"
                  type="number"
                  value={line.unitPrice || ""}
                  onChange={(e) =>
                    updateLineItem(idx, "unitPrice", Number(e.target.value))
                  }
                  fullWidth
                  required
                  size="small"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
              <Grid size={{ xs: 2, sm: 1 }}>
                <Tooltip title="Remove item">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => removeLine(idx)}
                      disabled={form.lineItems.length === 1}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 12, sm: 1 }}>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {formatKsh(line.quantity * line.unitPrice)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          size="small"
          startIcon={<AddOutlined />}
          onClick={addLine}
          sx={{ mt: 0.5 }}
        >
          Add Item
        </Button>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Total:&nbsp;
            <Typography
              component="span"
              variant="subtitle1"
              fontWeight={700}
              color="primary"
            >
              {formatKsh(draftTotal)}
            </Typography>
          </Typography>
        </Box>

        <TextField
          label="Notes (optional)"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          {isEditing ? "Save Changes" : "Create Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
