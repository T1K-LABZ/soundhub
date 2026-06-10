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
import { DASHBOARD_STATS, RECENT_ACTIVITY } from "./dashboard.data";
import {
  ACTIVITY_STATUS_COLOR,
  getAvatarInitials,
} from "./dashboard.constants";

// Icon map — keyed to stat colors since icons are UI-only, not from data
const STAT_ICONS: Record<string, React.ReactNode> = {
  "#D42F23": <SpeakerOutlined />,
  "#2563EB": <Inventory2Outlined />,
  "#16A34A": <PointOfSaleOutlined />,
  "#9333EA": <TrendingUpOutlined />,
};

type Modal = "sale" | "product" | "inventory" | null;

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [openModal, setOpenModal] = useState<Modal>(null);

  return (
    <Box>
      {/* Greeting */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">
          Welcome back, {user?.name ?? "Admin"} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PointOfSaleOutlined />}
            onClick={() => setOpenModal("sale")}
            size="large"
            sx={{ py: 1.5 }}
          >
            New Sale
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SpeakerOutlined />}
            onClick={() => setOpenModal("product")}
            size="large"
            sx={{ py: 1.5 }}
          >
            Add Product
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Inventory2Outlined />}
            onClick={() => setOpenModal("inventory")}
            size="large"
            sx={{ py: 1.5 }}
          >
            Check Item
          </Button>
        </Grid>
      </Grid>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {DASHBOARD_STATS.map((stat) => (
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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <List disablePadding>
          {RECENT_ACTIVITY.map((item, idx) => (
            <Box key={item.id}>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 36,
                      height: 36,
                      fontSize: 13,
                    }}
                  >
                    {getAvatarInitials(item.product)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.product}
                  secondary={item.time}
                  slotProps={{
                    primary: {
                      style: { fontWeight: 500, fontSize: "0.875rem" },
                    },
                    secondary: { style: { fontSize: "0.75rem" } },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 0.5,
                  }}
                >
                  <Chip
                    label={item.action}
                    color={ACTIVITY_STATUS_COLOR[item.action]}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.amount}
                  </Typography>
                </Box>
              </ListItem>
              {idx < RECENT_ACTIVITY.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>

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
