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
      onClick={() => onClick(product)}
    >
      <Box
        sx={{
          position: "relative",
          flex: { xs: "0 0 112px", sm: "none" },
          minHeight: { xs: 144, sm: "auto" },
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
          label={getStockLabel(product)}
          color={statusColor}
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{
              minWidth: 0,
              textTransform: "uppercase",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: 0,
            }}
          >
            {product.category}
          </Typography>
          {onEdit && (
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
          )}
        </Box>

        <Typography
          variant="body1"
          fontWeight={700}
          sx={{
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            bgcolor: "rgba(31, 41, 51, 0.04)",
            border: "1px solid",
            borderColor: "rgba(31, 41, 51, 0.06)",
            borderRadius: 1,
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.75, sm: 1 },
            mt: { xs: 0, sm: 0.5 },
            minWidth: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              In Stock
            </Typography>
            <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.1 }}>
              {product.stockQuantity.toLocaleString()}
            </Typography>
          </Box>
          {product.lowStockThreshold > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: { xs: "none", md: "block" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Alert at {product.lowStockThreshold.toLocaleString()}
            </Typography>
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
          {product.lowStockThreshold > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: { xs: "none", sm: "block", md: "none" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Alert at {product.lowStockThreshold.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
