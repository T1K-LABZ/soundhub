import { EditOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import type { Product } from "./products.types";
import { STOCK_STATUS_COLOR } from "./products.constants";
import { getStockLabel, getStockStatus } from "./products.utils";

type Props = {
  product: Product;
  onClick: (product: Product) => void;
  onEdit?: (product: Product) => void;
};

export function ProductCard({ product, onClick, onEdit }: Props) {
  const status = getStockStatus(product);
  const statusColor = STOCK_STATUS_COLOR[status];

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        "&:hover": { boxShadow: 6 },
      }}
      onClick={() => onClick(product)}
    >
      <CardMedia
        component="img"
        height={160}
        image={product.photoUrl}
        alt={product.name}
        sx={{ objectFit: "cover", bgcolor: "background.default" }}
      />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.75, pb: 1.5 }}>
        {/* Category + Edit */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {product.category}
          </Typography>
          {onEdit && (
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
          )}
        </Box>

        {/* Name */}
        <Typography variant="body1" fontWeight={600} sx={{ lineHeight: 1.3 }}>
          {product.name}
        </Typography>

        {/* Stock — prominent display */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "grey.50",
            borderRadius: 1,
            px: 1.5,
            py: 1,
            mt: 0.5,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              In Stock
            </Typography>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {product.stockQuantity.toLocaleString()}
            </Typography>
          </Box>
          <Chip
            label={getStockLabel(product)}
            color={statusColor}
            size="small"
            variant="outlined"
          />
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
          {product.lowStockThreshold > 0 && (
            <Typography variant="caption" color="text.secondary">
              Alert at {product.lowStockThreshold.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
