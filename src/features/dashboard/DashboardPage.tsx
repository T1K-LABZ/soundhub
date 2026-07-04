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
  AVATAR_COLORS,
  AVATAR_TEXT_COLORS,
  getAvatarInitials,
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
  const [openModal, setOpenModal] = useState<Modal>(null);

  return (
    <Box>
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
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", p: 3 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <List disablePadding>
          {RECENT_ACTIVITY.map((item, idx) => (
            <Box key={item.id}>
              <ListItem disablePadding sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: AVATAR_COLORS[item.action],
                      color: AVATAR_TEXT_COLORS[item.action],
                      fontSize: 13,
                      height: 36,
                      width: 36,
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
                      style: { fontSize: "0.875rem", fontWeight: 500 },
                    },
                    secondary: { style: { fontSize: "0.75rem" } },
                  }}
                />
                <Box
                  sx={{ alignItems: "center", display: "flex", gap: 1.5 }}
                >
                  <Chip
                    color={ACTIVITY_STATUS_COLOR[item.action]}
                    label={item.action}
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 60, textAlign: "right" }}
                  >
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
