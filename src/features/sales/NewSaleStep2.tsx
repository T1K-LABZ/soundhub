import { DeleteOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
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
import { useServicesQuery } from "./sales.api";
import type { InventoryItemResponse } from "../products/products.types";
import type { JobProduct, ServiceType, StepErrors } from "./sales.types";
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
  errors?: StepErrors;
  triedToContinue?: boolean;
};

const SERVICE_TYPE_OPTIONS: ServiceType[] = [
  "Installation",
  "Correction",
  "Product Only",
  "Diagnostic",
  "Warranty Job",
  "Upgrade",
];

export function NewSaleStep2({ data, onChange, errors = {}, triedToContinue = false }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: apiServices = [] } = useServicesQuery(storeId);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: searchResults = [], isFetching: searchLoading } =
    useProductSearchQuery(storeId, debouncedSearch);

  function set<K extends keyof Step2Data>(key: K, value: Step2Data[K]) {
    onChange({ ...data, [key]: value });
  }

  function fieldError(key: keyof StepErrors): string | undefined {
    return triedToContinue ? errors[key] : undefined;
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

  function selectProduct(item: InventoryItemResponse) {
    const alreadySelected = data.products.find((p) => p.productId === item.id);
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
    set("products", [...data.products, line]);
    setSearchInput("");
    setDebouncedSearch("");
  }

  function updateProductQty(idx: number, qty: number) {
    const updated = data.products.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p, quantity: qty, lineTotal: qty * p.unitPrice };
      return next;
    });
    set("products", updated);
  }

  function updateProductPrice(idx: number, price: number) {
    const updated = data.products.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p, unitPrice: price, lineTotal: p.quantity * price };
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
        error={!!fieldError("serviceType")}
        helperText={fieldError("serviceType")}
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
      {data.products.length > 0 && (
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 0.5, display: "block" }}>
          Selected Products ({data.products.length})
        </Typography>
      )}
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
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField
                size="small"
                type="number"
                label="Unit Price"
                fullWidth
                value={p.unitPrice}
                onChange={(e) => updateProductPrice(idx, Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 2, sm: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Total
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

      {/* Prompt to search when no products selected */}
      {data.products.length === 0 && !debouncedSearch && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
          Search for a product above to add it to this job
        </Typography>
      )}

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
