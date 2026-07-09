import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../auth/auth.store";
import { useItemsQuery } from "../inventory/inventory.api";
import { useServicesQuery } from "./sales.api";
import type { JobProduct, ServiceType } from "./sales.types";
import { formatKsh } from "./sales.utils";

export type Step2Data = {
  serviceType: ServiceType | "";
  services: { id: string; name: string; basePrice: number }[];
  products: JobProduct[];
  discount: number;
};

type Props = {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
};

const SERVICE_TYPE_OPTIONS: ServiceType[] = [
  "Installation",
  "Correction",
  "Product Only",
  "Diagnostic",
  "Warranty Job",
  "Upgrade",
];

export function NewSaleStep2({ data, onChange }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: apiServices = [] } = useServicesQuery(storeId);
  const { data: apiProducts = [] } = useItemsQuery(storeId);

  function set<K extends keyof Step2Data>(key: K, value: Step2Data[K]) {
    onChange({ ...data, [key]: value });
  }

  // ── Services ────────────────────────────────────────────────────────────────

  function addService(id: string) {
    const svc = apiServices.find((s) => s.id === id);
    if (!svc || data.services.find((s) => s.id === id)) return;
    set("services", [...data.services, { id: svc.id, name: svc.name, basePrice: Number(svc.basePrice) }]);
  }

  function removeService(id: string) {
    set(
      "services",
      data.services.filter((s) => s.id !== id),
    );
  }

  // ── Products ────────────────────────────────────────────────────────────────

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
    set("products", [...data.products, line]);
  }

  function updateProduct(
    idx: number,
    field: keyof JobProduct,
    value: string | number,
  ) {
    const updated = data.products.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p, [field]: value };
      if (field === "productId") {
        const found = apiProducts.find((ip) => ip.id === value);
        if (found) {
          next.productName = found.name;
          next.unitPrice = Number(found.sellingPrice);
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
      data.products.filter((_, i) => i !== idx),
    );
  }

  const productsSubtotal = data.products.reduce((s, p) => s + Number(p.lineTotal), 0);
  const servicesSubtotal = data.services.reduce(
    (s, svc) => s + Number(svc.basePrice),
    0,
  );
  const discount = Number(data.discount) || 0;
  const grandTotal = Math.max(
    0,
    productsSubtotal + servicesSubtotal - discount,
  );

  return (
    <Box>
      <TextField
        select
        label="Service Type"
        size="small"
        value={data.serviceType}
        onChange={(e) => set("serviceType", e.target.value as ServiceType)}
        fullWidth
        sx={{ mb: 2 }}
        required
      >
        {SERVICE_TYPE_OPTIONS.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="subtitle2" mb={1} fontWeight={800}>
        Services
      </Typography>
      {data.services.map((svc) => (
        <Box
          key={svc.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 1,
            mb: 0.75,
            p: 1.25,
            border: 1,
            borderColor: "rgba(31, 41, 51, 0.08)",
            borderRadius: 1,
            bgcolor: "rgba(31, 41, 51, 0.03)",
          }}
        >
          <Typography variant="body2" fontWeight={700} noWrap>{svc.name}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {formatKsh(svc.basePrice)}
            </Typography>
            <IconButton size="small" onClick={() => removeService(svc.id)}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
      <TextField
        select
        label="+ Add Service"
        size="small"
        value=""
        onChange={(e) => addService(e.target.value)}
        fullWidth
        sx={{ mt: 1, mb: 2 }}
      >
        {apiServices
          .filter((s) => s.active)
          .map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name} — {formatKsh(s.basePrice)}
            </MenuItem>
          ))}
      </TextField>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" mb={1} fontWeight={800}>
        Products
      </Typography>
      {data.products.map((p, idx) => (
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
            <TextField
              select
              size="small"
              label="Product"
              fullWidth
              value={p.productId}
              onChange={(e) => updateProduct(idx, "productId", e.target.value)}
            >
              {apiProducts.map((ip) => (
                <MenuItem key={ip.id} value={ip.id}>
                  {ip.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 2 }}>
            <TextField
              size="small"
              type="number"
              label="Qty"
              fullWidth
              value={p.quantity}
              onChange={(e) =>
                updateProduct(idx, "quantity", Number(e.target.value))
              }
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 2 }}>
            <TextField
              size="small"
              type="number"
              label="Unit Price"
              fullWidth
              value={p.unitPrice}
              onChange={(e) =>
                updateProduct(idx, "unitPrice", Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={{ xs: 10, sm: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Line Total
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {formatKsh(p.lineTotal)}
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
      <Button
        size="small"
        startIcon={<AddOutlined />}
        onClick={addProduct}
        variant="outlined"
        sx={{ mb: 2, minHeight: 38 }}
      >
        Add Product
      </Button>

      <Divider sx={{ my: 2 }} />

      {/* Totals */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          maxWidth: { xs: "none", sm: 320 },
          ml: "auto",
          p: 1.5,
          border: 1,
          borderColor: "rgba(31, 41, 51, 0.08)",
          borderRadius: 1,
          bgcolor: "rgba(31, 41, 51, 0.03)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Products
          </Typography>
          <Typography variant="body2">{formatKsh(productsSubtotal)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Services
          </Typography>
          <Typography variant="body2">{formatKsh(servicesSubtotal)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Discount
          </Typography>
          <TextField
            size="small"
            type="number"
            value={data.discount}
            onChange={(e) => set("discount", Number(e.target.value))}
            sx={{ width: 110 }}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography variant="body2" fontWeight={700}>
            Grand Total
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatKsh(grandTotal)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
