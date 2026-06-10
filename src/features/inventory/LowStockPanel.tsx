import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  ReportProblemOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { InventoryProduct } from "./inventory.types";
import { formatKsh } from "./inventory.utils";

type Props = {
  products: InventoryProduct[];
};

export function LowStockPanel({ products }: Props) {
  const [open, setOpen] = useState(true);

  const alerts = products.filter((p) => p.quantityOnHand <= p.reorderPoint);

  if (alerts.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ mt: 3, borderColor: "warning.main" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReportProblemOutlined
            sx={{ color: "warning.main" }}
            fontSize="small"
          />
          <Typography variant="subtitle2" fontWeight={700}>
            Stock Alerts — {alerts.length} item{alerts.length !== 1 ? "s" : ""}{" "}
            need attention
          </Typography>
        </Box>
        <IconButton size="small">
          {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Divider />
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {alerts.map((product) => {
            const isOut = product.quantityOnHand === 0;
            const pct = isOut
              ? 0
              : Math.min(
                  (product.quantityOnHand / product.reorderPoint) * 100,
                  100,
                );

            return (
              <Box key={product.productId}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {product.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.serial} · {product.brand} · Selling:{" "}
                      {formatKsh(product.sellingPrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={isOut ? "Out of Stock" : "Low Stock"}
                      color={isOut ? "error" : "warning"}
                      size="small"
                      variant="outlined"
                    />
                    <Button size="small" variant="outlined" color="primary">
                      Reorder
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    color={isOut ? "error" : "warning"}
                    sx={{ flex: 1, height: 6, borderRadius: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 80, textAlign: "right" }}
                  >
                    {product.quantityOnHand} / {product.reorderPoint} threshold
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Paper>
  );
}
