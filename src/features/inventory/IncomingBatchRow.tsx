import { DeleteOutlined, QrCodeScannerOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { InventoryItemResponse } from "../products/products.types";

type Props = {
  item: CreateIncomingBatchItem;
  index: number;
  products: InventoryItemResponse[];
  canRemove: boolean;
  onScanClick: (itemId: string) => void;
  onChange: (updated: CreateIncomingBatchItem) => void;
  onRemove: (itemId: string) => void;
};

export function IncomingBatchRow({
  item,
  index,
  products,
  canRemove,
  onScanClick,
  onChange,
  onRemove,
}: Props) {
  function set<K extends keyof CreateIncomingBatchItem>(
    k: K,
    v: CreateIncomingBatchItem[K],
  ) {
    onChange({ ...item, [k]: v });
  }

  function handleProductChange(productId: string) {
    const product = products.find((p) => p.id === productId);
    onChange({
      ...item,
      productId,
      buyingPrice: product?.costPrice ?? 0,
      sellingPrice: product?.sellingPrice ?? 0,
    });
  }

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

      {/* Product selector with scan icon */}
      <TextField
        select
        label="Product"
        value={item.productId}
        onChange={(e) => handleProductChange(e.target.value)}
        fullWidth
        required
        size="small"
        sx={{ mb: 1.5 }}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ mr: 2, display: "flex" }}>
                <Tooltip title="Scan barcode to find product">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => onScanClick(item.id)}
                  >
                    <QrCodeScannerOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        }}
      >
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name} ({p.barcode || p.id})
          </MenuItem>
        ))}
      </TextField>

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
