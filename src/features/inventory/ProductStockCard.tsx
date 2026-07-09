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
        flexDirection: { xs: "row", sm: "column" },
        overflow: "hidden",
        border: "1px solid",
        borderColor: "rgba(31, 41, 51, 0.08)",
        boxShadow: "0 10px 28px rgba(31, 41, 51, 0.06)",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        cursor: "pointer",
        "&:hover": {
          borderColor: "rgba(247, 0, 0, 0.2)",
          boxShadow: "0 16px 36px rgba(31, 41, 51, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          flex: { xs: "0 0 112px", sm: "none" },
          minHeight: { xs: 142, sm: "auto" },
          bgcolor: "background.default",
        }}
      >
        <CardMedia
          component="img"
          height={160}
          image={product.photoUrl}
          alt={product.name}
          sx={{
            width: "100%",
            height: { xs: "100%", sm: 160 },
            objectFit: "cover",
            bgcolor: "background.default",
          }}
        />
        <Chip
          label={status === "out" ? "Out of Stock" : `${product.stockQuantity.toLocaleString()} units`}
          color={stockColor}
          size="small"
          sx={{
            position: "absolute",
            top: { xs: 6, sm: 8 },
            right: { xs: 6, sm: 8 },
            maxWidth: { xs: 96, sm: "calc(100% - 16px)" },
            fontWeight: 700,
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.75, sm: 1 },
          minWidth: 0,
          p: { xs: 1.25, sm: 2 },
          "&:last-child": { pb: { xs: 1.25, sm: 2 } },
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{
            textTransform: "uppercase",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0,
          }}
        >
          {product.category}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={700}
          sx={{
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: { xs: 2, sm: 2 },
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ mt: { xs: 0, sm: 0.5 } }}>
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
            sx={{
              height: { xs: 5, sm: 6 },
              borderRadius: 3,
              bgcolor: "rgba(31, 41, 51, 0.08)",
            }}
          />
          {status === "low" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, minWidth: 0 }}>
              <WarningAmberOutlined sx={{ fontSize: 14, color: "warning.main" }} />
              <Typography
                variant="caption"
                color="warning.main"
                fontWeight={600}
                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                Low stock, alert at {product.lowStockThreshold.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "baseline" },
            gap: 1,
            mt: "auto",
            minWidth: 0,
          }}
        >
          <Typography
            variant="subtitle1"
            color="primary"
            fontWeight={800}
            sx={{ lineHeight: 1.2, whiteSpace: "nowrap" }}
          >
            KSh {product.sellingPrice.toLocaleString()}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: { xs: "none", sm: "block" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Cost: KSh {product.buyingPrice.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 0.5,
            mt: { xs: 0, sm: 0.5 },
          }}
        >
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              sx={{
                width: 34,
                height: 34,
                color: "text.secondary",
                bgcolor: "rgba(31, 41, 51, 0.04)",
                "&:hover": { color: "primary.main", bgcolor: "rgba(247, 0, 0, 0.08)" },
              }}
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
              sx={{
                width: 34,
                height: 34,
                color: "text.secondary",
                bgcolor: "rgba(31, 41, 51, 0.04)",
                "&:hover": { color: "success.main", bgcolor: "rgba(46, 125, 50, 0.08)" },
              }}
            >
              <CallReceivedOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
