import {
  CallReceivedOutlined,
  EditOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Product } from "../products/products.types";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onReceive: (product: Product) => void;
  onClick: (product: Product) => void;
};

function getStockStatus(product: Product): "ok" | "low" | "out" {
  if (product.stockQuantity === 0) return "out";
  if (product.stockQuantity <= product.lowStockThreshold) return "low";
  return "ok";
}

function getStockColor(status: "ok" | "low" | "out") {
  if (status === "out") return "error";
  if (status === "low") return "warning";
  return "success";
}

function getStockPercent(product: Product): number {
  if (product.lowStockThreshold === 0) return product.stockQuantity > 0 ? 100 : 0;
  const max = product.lowStockThreshold * 4;
  return Math.min(100, Math.round((product.stockQuantity / max) * 100));
}

export function ProductStockCard({ product, onEdit, onReceive, onClick }: Props) {
  const status = getStockStatus(product);
  const stockColor = getStockColor(status);
  const stockPercent = getStockPercent(product);

  return (
    <Card
      onClick={() => onClick(product)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": { boxShadow: 6 },
      }}
    >
      {/* Product image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={160}
          image={product.photoUrl}
          alt={product.name}
          sx={{ objectFit: "cover", bgcolor: "background.default" }}
        />
        {/* Stock badge overlay */}
        <Chip
          label={status === "out" ? "Out of Stock" : `${product.stockQuantity.toLocaleString()} units`}
          color={stockColor}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            fontWeight: 700,
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Category */}
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {product.category}
        </Typography>

        {/* Name */}
        <Typography variant="body1" fontWeight={600} sx={{ lineHeight: 1.3 }}>
          {product.name}
        </Typography>

        {/* Stock level bar */}
        <Box sx={{ mt: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Stock Level
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {product.stockQuantity.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stockPercent}
            color={stockColor}
            sx={{ height: 6, borderRadius: 3 }}
          />
          {status === "low" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <WarningAmberOutlined sx={{ fontSize: 14, color: "warning.main" }} />
              <Typography variant="caption" color="warning.main" fontWeight={500}>
                Low stock — alert at {product.lowStockThreshold.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Price row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            mt: "auto",
          }}
        >
          <Typography variant="subtitle1" color="primary" fontWeight={700}>
            KSh {product.sellingPrice.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cost: KSh {product.buyingPrice.toLocaleString()}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mt: 0.5 }}>
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Receive Stock">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onReceive(product);
              }}
              sx={{ color: "text.secondary", "&:hover": { color: "success.main" } }}
            >
              <CallReceivedOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
