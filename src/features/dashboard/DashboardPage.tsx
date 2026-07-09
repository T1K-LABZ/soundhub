import {
  Inventory2Outlined,
  PointOfSaleOutlined,
  SpeakerOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
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
          <Box sx={{ display: "flex", gap: 1.5, mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<PointOfSaleOutlined />}
              onClick={() => setOpenModal("sale")}
              sx={{ px: 3, py: 1 }}
            >
              New Sale
            </Button>
            <Button
              variant="outlined"
              startIcon={<SpeakerOutlined />}
              onClick={() => setOpenModal("product")}
              sx={{ px: 3, py: 1 }}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<Inventory2Outlined />}
              onClick={() => setOpenModal("inventory")}
              sx={{ px: 3, py: 1 }}
            >
              Check Item
            </Button>
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