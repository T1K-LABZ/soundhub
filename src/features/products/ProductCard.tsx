import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import type { Product } from "./products.types";
import { STOCK_STATUS_COLOR } from "./products.constants";
import { getStockLabel, getStockStatus } from "./products.utils";

type Props = {
  product: Product;
  onClick: (product: Product) => void;
};

export function ProductCard({ product, onClick }: Props) {
  const status = getStockStatus(product);
  const statusColor = STOCK_STATUS_COLOR[status];

  return (
    <Card
      onClick={() => onClick(product)}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": { boxShadow: 4 },
      }}
    >
      {/* Product image */}
      <CardMedia
        component="img"
        height={180}
        image={product.photoUrl}
        alt={product.name}
        sx={{ objectFit: "cover", bgcolor: "background.default" }}
      />

      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* Category + stock badge */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {product.category}
          </Typography>
          <Chip
            label={getStockLabel(product)}
            color={statusColor}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Name */}
        <Typography variant="body1" fontWeight={600} sx={{ lineHeight: 1.3 }}>
          {product.name}
        </Typography>

        {/* Price row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            mt: "auto",
          }}
        >
          <Typography variant="h6" color="primary" fontWeight={700}>
            KSh {product.sellingPrice.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {product.stockQuantity} units
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
