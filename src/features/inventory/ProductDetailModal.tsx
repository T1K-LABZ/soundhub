import {
  AddOutlined,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  Inventory2Outlined,
  PersonOutlined,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../auth/auth.store";
import { useStockMovementsQuery } from "./inventory.api";
import type { Product } from "../products/products.types";
import { formatKsh } from "../sales/sales.utils";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

const MOVEMENT_TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  RESTOCK: { color: "#4CAF50", icon: <AddOutlined fontSize="small" />, label: "Restock" },
  SALE: { color: "#F44336", icon: <ArrowDownwardOutlined fontSize="small" />, label: "Sale" },
  ADJUSTMENT: { color: "#FF9800", icon: <Inventory2Outlined fontSize="small" />, label: "Adjustment" },
  RETURN: { color: "#2196F3", icon: <ArrowUpwardOutlined fontSize="small" />, label: "Return" },
};

export function ProductDetailModal({ open, product, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data, isLoading } = useStockMovementsQuery(storeId, product?.id ?? "");

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {product.photoUrl ? (
            <Box
              component="img"
              src={product.photoUrl}
              alt={product.name}
              sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1.5,
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary.dark">
                {product.name[0]}
              </Typography>
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} noWrap>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {product.category} · Stock: {product.stockQuantity} units
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Stock summary */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <SummaryCard label="Current Stock" value={`${product.stockQuantity}`} color="#1565C0" />
          <SummaryCard label="Buy Price" value={formatKsh(product.buyingPrice)} color="#7B1FA2" />
          <SummaryCard label="Sell Price" value={formatKsh(product.sellingPrice)} color="#2E7D32" />
        </Box>

        {/* Stock movements */}
        <Typography variant="overline" color="text.secondary" display="block" mb={1}>
          STOCK HISTORY
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : !data?.movements || data.movements.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Inventory2Outlined sx={{ fontSize: 36, color: "text.disabled", mb: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No stock movements yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {data.movements.map((movement, idx) => {
              const config = MOVEMENT_TYPE_CONFIG[movement.type] || {
                color: "#9E9E9E",
                icon: <Inventory2Outlined fontSize="small" />,
                label: movement.type,
              };
              const isLast = idx === data.movements.length - 1;

              return (
                <Box key={movement.id} sx={{ display: "flex", gap: 1.5 }}>
                  {/* Timeline line + dot */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: `${config.color}18`,
                        color: config.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </Box>
                    {!isLast && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: "divider", my: 0.5 }} />
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, pb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {config.label}
                          {movement.metadata?.mode === "activate_stock_batch" && (
                            <Typography component="span" variant="caption" color="text.secondary" ml={0.5}>
                              (Batch Activation)
                            </Typography>
                          )}
                          {movement.metadata?.saleType === "counter_sale" && (
                            <Typography component="span" variant="caption" color="text.secondary" ml={0.5}>
                              (Counter Sale)
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(movement.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color={movement.type === "SALE" ? "error.main" : "success.main"}
                      >
                        {movement.type === "SALE" ? "-" : "+"}{movement.quantity}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Stock: {movement.stockAfter}
                      </Typography>
                      {movement.unitCost && Number(movement.unitCost) > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          @ {formatKsh(Number(movement.unitCost))}
                        </Typography>
                      )}
                      {movement.user && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                          <PersonOutlined sx={{ fontSize: 12 }} />
                          {movement.user.fullName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: `${color}08`,
        border: "1px solid",
        borderColor: `${color}20`,
        borderRadius: 1.5,
        p: 1.5,
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700} color={color}>
        {value}
      </Typography>
    </Box>
  );
}
