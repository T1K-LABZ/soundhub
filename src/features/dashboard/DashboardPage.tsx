import {
  Inventory2Outlined,
  PointOfSaleOutlined,
  SpeakerOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StatCard } from "../../components/ui/StatCard";
import { CheckItemModal } from "../inventory/CheckItemModal";
import { AddProductModal } from "../products/AddProductModal";
import { NewSaleModal } from "../sales/NewSaleModal";
import { useAuthStore } from "../auth/auth.store";
import { useDashboardQuery } from "./dashboard.api";
import {
  AVATAR_COLORS,
  AVATAR_TEXT_COLORS,
  getMovementLabel,
  MOVEMENT_STATUS_COLOR,
} from "./dashboard.constants";

const STAT_ICONS: Record<string, React.ReactNode> = {
  "#F70000": <SpeakerOutlined />,
  "#2563EB": <Inventory2Outlined />,
  "#16A34A": <PointOfSaleOutlined />,
  "#9333EA": <TrendingUpOutlined />,
};

type Modal = "sale" | "product" | "inventory" | null;

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const [openModal, setOpenModal] = useState<Modal>(null);

  const { data: dashboardData, isLoading } = useDashboardQuery(storeId);

  const stats = dashboardData?.data;

  const dashboardStats = stats
    ? [
        {
          label: "Total Products",
          value: stats.totalProducts.toLocaleString(),
          color: "#F70000",
        },
        {
          label: "Items in Stock",
          value: stats.totalItemsInStock.toLocaleString(),
          color: "#2563EB",
        },
        {
          label: "Today's Sales",
          value: stats.totalSalesToday.toLocaleString(),
          color: "#16A34A",
        },
        {
          label: "Today's Revenue",
          value: `KSh ${stats.todayRevenue.toLocaleString()}`,
          color: "#9333EA",
        },
      ]
    : [
        { label: "Total Products", value: "0", color: "#F70000" },
        { label: "Items in Stock", value: "0", color: "#2563EB" },
        { label: "Today's Sales", value: "0", color: "#16A34A" },
        { label: "Today's Revenue", value: "KSh 0", color: "#9333EA" },
      ];

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 16 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Greeting */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Welcome back, {user?.name ?? "Admin"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Here's what's happening with your store today.
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }, gap: 1.5, mb: 4 }}>
            <Paper
              onClick={() => setOpenModal("sale")}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: "#F70000",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(247, 0, 0, 0.25)",
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(247, 0, 0, 0.35)" },
              }}
            >
              <Box sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: 2, bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                <PointOfSaleOutlined fontSize="small" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700}>New Sale</Typography>
            </Paper>
            <Paper
              onClick={() => setOpenModal("product")}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "transform 0.15s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Box sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: 2, bgcolor: "#ffebee", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5, color: "#F70000" }}>
                <SpeakerOutlined fontSize="small" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} color="#F70000">Add Product</Typography>
            </Paper>
            <Paper
              onClick={() => setOpenModal("inventory")}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "transform 0.15s",
                "&:hover": { transform: "translateY(-2px)" },
                gridColumn: { xs: "span 2", sm: "span 1" },
              }}
            >
              <Box sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: 2, bgcolor: "#ffebee", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5, color: "#F70000" }}>
                <Inventory2Outlined fontSize="small" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} color="#F70000">Check Item</Typography>
            </Paper>
          </Box>

          {/* Stat cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {dashboardStats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  icon={STAT_ICONS[stat.color]}
                  color={stat.color}
                />
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Paper
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", p: 3 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List disablePadding>
              {stats?.recentMovements.map((movement, idx) => {
                const movementType = movement.type as "SALE" | "RECEIVE" | "ADJUSTMENT";
                return (
                  <Box key={movement.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: AVATAR_COLORS[movementType],
                            color: AVATAR_TEXT_COLORS[movementType],
                            fontSize: 13,
                            height: 36,
                            width: 36,
                          }}
                        >
                          {getMovementLabel(movementType)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={movement.product.name}
                        secondary={new Date(movement.createdAt).toLocaleString()}
                        slotProps={{
                          primary: {
                            style: { fontSize: "0.875rem", fontWeight: 500 },
                          },
                          secondary: { style: { fontSize: "0.75rem" } },
                        }}
                      />
                      <Box
                        sx={{ alignItems: "center", display: "flex", gap: 1.5 }}
                      >
                        <Chip
                          color={MOVEMENT_STATUS_COLOR[movementType]}
                          label={getMovementLabel(movementType)}
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ minWidth: 60, textAlign: "right" }}
                        >
                          {movementType === "SALE"
                            ? `-${movement.quantity} units`
                            : `+${movement.quantity} units`}
                        </Typography>
                      </Box>
                    </ListItem>
                    {stats.recentMovements.length > 0 &&
                      idx < stats.recentMovements.length - 1 && <Divider />}
                  </Box>
                );
              })}
              {stats?.recentMovements.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 3, textAlign: "center" }}
                >
                  No recent activity
                </Typography>
              )}
            </List>
          </Paper>
        </>
      )}

      {/* Modals */}
      <NewSaleModal
        open={openModal === "sale"}
        onClose={() => setOpenModal(null)}
      />
      <AddProductModal
        open={openModal === "product"}
        onClose={() => setOpenModal(null)}
      />
      <CheckItemModal
        open={openModal === "inventory"}
        onClose={() => setOpenModal(null)}
      />
    </Box>
  );
}