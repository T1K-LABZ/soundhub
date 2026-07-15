import { DeleteOutlined, QrCodeScannerOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useProductSearchQuery } from "./inventory.api";
import type { CreateIncomingBatchItem } from "./inventory.types";
import type { InventoryItemResponse } from "../products/products.types";

type Props = {
  item: CreateIncomingBatchItem;
  index: number;
  products: InventoryItemResponse[];
  canRemove: boolean;
  storeId: string;
  onScanClick: (itemId: string) => void;
  onChange: (updated: CreateIncomingBatchItem) => void;
  onRemove: (itemId: string) => void;
};

export function IncomingBatchRow({
  item,
  index,
  products,
  canRemove,
  storeId,
  onScanClick,
  onChange,
  onRemove,
}: Props) {
  const [searchInput, setSearchInput] = useState(
    item.productName || (item.productId ? products.find((p) => p.id === item.productId)?.name || "" : ""),
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (item.productName && !searchInput) {
      setSearchInput(item.productName);
    } else if (item.productId && !searchInput && products.length > 0) {
      const match = products.find((p) => p.id === item.productId);
      if (match) setSearchInput(match.name);
    }
  }, [item.productId, item.productName, products, searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: searchResults = [], isFetching: searchLoading } =
    useProductSearchQuery(storeId, debouncedSearch);

  const selectedProduct = item.productId
    ? products.find((p) => p.id === item.productId)
    : null;

  function set<K extends keyof CreateIncomingBatchItem>(
    k: K,
    v: CreateIncomingBatchItem[K],
  ) {
    onChange({ ...item, [k]: v });
  }

  function selectProduct(product: InventoryItemResponse) {
    setSearchInput(product.name);
    setDebouncedSearch("");
    setShowResults(false);
    onChange({
      ...item,
      productId: product.id,
      productName: product.name,
      buyingPrice: product.costPrice ?? 0,
      sellingPrice: product.sellingPrice ?? 0,
    });
  }

  const matchedFromSearch = debouncedSearch
    ? searchResults
    : [];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        position: "relative",
      }}
    >
      {/* Row label + remove button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          ITEM {index + 1}
        </Typography>
        {canRemove && (
          <Tooltip title="Remove this item">
            <IconButton
              size="small"
              color="error"
              onClick={() => onRemove(item.id)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Product search */}
      <TextField
        size="small"
        placeholder="Search product by name..."
        fullWidth
        required
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setShowResults(true);
          if (item.productId) {
            onChange({
              ...item,
              productId: "",
              productName: e.target.value,
              buyingPrice: 0,
              sellingPrice: 0,
            });
          } else {
            onChange({ ...item, productName: e.target.value });
          }
        }}
        onFocus={() => setShowResults(true)}
        sx={{ mb: 1.5 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {searchLoading && <CircularProgress size={16} />}
                <Tooltip title="Scan barcode">
                  <IconButton size="small" edge="end" onClick={() => onScanClick(item.id)}>
                    <QrCodeScannerOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        }}
      />

      {/* Search results dropdown */}
      {showResults && debouncedSearch && matchedFromSearch.length > 0 && (
        <Box
          sx={{
            maxHeight: 180,
            overflow: "auto",
            mb: 1.5,
            border: 1,
            borderColor: "rgba(31, 41, 51, 0.08)",
            borderRadius: 1,
          }}
        >
          {matchedFromSearch.map((p) => (
            <Box
              key={p.id}
              onClick={() => selectProduct(p)}
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
                src={p.photoUrl}
                alt={p.name}
                variant="rounded"
                sx={{ width: 40, height: 40, bgcolor: "rgba(31, 41, 51, 0.08)" }}
              >
                {p.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {p.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.barcode || p.id}
                </Typography>
              </Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                Stock: {p.itemsInStock}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {showResults && debouncedSearch && !searchLoading && matchedFromSearch.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block", fontStyle: "italic" }}>
          No products found
        </Typography>
      )}

      {/* Selected product badge */}
      {selectedProduct && !showResults && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            p: 1,
            bgcolor: "rgba(31, 41, 51, 0.03)",
            borderRadius: 1,
          }}
        >
          <Avatar
            src={selectedProduct.photoUrl}
            alt={selectedProduct.name}
            variant="rounded"
            sx={{ width: 32, height: 32, bgcolor: "rgba(31, 41, 51, 0.08)" }}
          >
            {selectedProduct.name.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {selectedProduct.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedProduct.barcode}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Qty + status + prices on one row */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <TextField
          label="Qty"
          type="number"
          value={item.quantity || ""}
          onChange={(e) => set("quantity", Number(e.target.value))}
          required
          size="small"
          sx={{ flex: "1 1 70px", minWidth: 70 }}
          slotProps={{ htmlInput: { min: 1 } }}
        />
        <TextField
          select
          label="Status"
          value={item.status}
          onChange={(e) => set("status", e.target.value as "IN_TRANSIT" | "PENDING" | "ACTIVE")}
          size="small"
          sx={{ flex: "1 1 110px", minWidth: 110 }}
        >
          <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
        </TextField>
        {item.status === "ACTIVE" && (
          <Alert severity="info" sx={{ flex: "1 1 100%", py: 0 }}>
            Activating this batch will apply the prices above as the default product prices.
          </Alert>
        )}
        <TextField
          label="Buying Price (KSh)"
          type="number"
          value={item.buyingPrice || ""}
          onChange={(e) => set("buyingPrice", Number(e.target.value))}
          required
          size="small"
          sx={{ flex: "2 1 130px", minWidth: 130 }}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Selling Price (KSh)"
          type="number"
          value={item.sellingPrice || ""}
          onChange={(e) => set("sellingPrice", Number(e.target.value))}
          required
          size="small"
          sx={{ flex: "2 1 130px", minWidth: 130 }}
          slotProps={{ htmlInput: { min: 0 } }}
          helperText="This batch's price — won't affect existing stock"
        />
      </Box>

      {/* Margin preview */}
      {item.buyingPrice > 0 && item.sellingPrice > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          Margin: KSh {(item.sellingPrice - item.buyingPrice).toLocaleString()}{" "}
          (
          {Math.round(
            ((item.sellingPrice - item.buyingPrice) / item.buyingPrice) * 100,
          )}
          %)
        </Typography>
      )}
    </Box>
  );
}
