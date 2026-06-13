import {
  DashboardOutlined,
  Inventory2Outlined,
  PeopleOutlined,
  PersonOutlined,
  PointOfSaleOutlined,
  QueryStatsOutlined,
  ReceiptOutlined,
  SpeakerOutlined,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ROUTES, type AppRoute } from "../../router/routes";

type Props = {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
};

type NavigationItem = {
  label: string;
  path: AppRoute;
  icon: React.ReactNode;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: <DashboardOutlined /> },
  { label: "Products", path: ROUTES.products, icon: <SpeakerOutlined /> },
  { label: "Inventory", path: ROUTES.inventory, icon: <Inventory2Outlined /> },
  { label: "Sales", path: ROUTES.sales, icon: <PointOfSaleOutlined /> },
  { label: "Customers", path: ROUTES.customers, icon: <PersonOutlined /> },
  { label: "Invoices", path: ROUTES.invoices, icon: <ReceiptOutlined /> },
  { label: "Reports", path: ROUTES.reports, icon: <QueryStatsOutlined /> },
  { label: "Staff", path: ROUTES.staff, icon: <PeopleOutlined /> },
];

// Shared nav content — used by both drawer variants
function NavContent({
  drawerWidth,
  onClose,
}: {
  drawerWidth: number;
  onClose: () => void;
}) {
  const location = useLocation();

  return (
    <Box sx={{ width: drawerWidth, overflowX: "hidden" }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography color="primary" variant="h6">
          SoundHub Inventory
        </Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ borderRadius: 1, mb: 0.5 }}
            // Close the mobile drawer after navigation
            onClick={onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export function Sidebar({ drawerWidth, mobileOpen, onClose }: Props) {
  const drawerSx = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      borderRightColor: "divider",
    },
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: 0, md: drawerWidth },
        flexShrink: 0,
      }}
    >
      {/* ── Mobile: temporary drawer, slides over content ── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // better performance on mobile
        sx={{
          display: { xs: "block", md: "none" },
          ...drawerSx,
        }}
      >
        <NavContent drawerWidth={drawerWidth} onClose={onClose} />
      </Drawer>

      {/* ── Desktop: permanent drawer, always visible ── */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          ...drawerSx,
        }}
      >
        <NavContent drawerWidth={drawerWidth} onClose={onClose} />
      </Drawer>
    </Box>
  );
}
