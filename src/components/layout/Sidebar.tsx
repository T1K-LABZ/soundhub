import {
  ChevronLeft,
  ChevronRight,
  DashboardOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  LogoutOutlined,
  PeopleOutlined,
  PersonOutlined,
  PointOfSaleOutlined,
  QueryStatsOutlined,
  ReceiptOutlined,
  SpeakerOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../features/auth/auth.api";
import { useAuthStore } from "../../features/auth/auth.store";
import { ROUTES, type AppRoute } from "../../router/routes";

type NavigationItem = {
  label: string;
  path: AppRoute;
  icon: React.ReactNode;
  permissionKey?: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: <DashboardOutlined />, permissionKey: "dashboard" },
  { label: "Products", path: ROUTES.products, icon: <SpeakerOutlined />, permissionKey: "products" },
  { label: "Inventory", path: ROUTES.inventory, icon: <Inventory2Outlined />, permissionKey: "inventory" },
  { label: "Sales", path: ROUTES.sales, icon: <PointOfSaleOutlined />, permissionKey: "sales" },
  { label: "Orders", path: ROUTES.orders, icon: <LocalShippingOutlined /> },
  { label: "Customers", path: ROUTES.customers, icon: <PersonOutlined />, permissionKey: "customers" },
  { label: "Invoices", path: ROUTES.invoices, icon: <ReceiptOutlined />, permissionKey: "invoices" },
  { label: "Reports", path: ROUTES.reports, icon: <QueryStatsOutlined />, permissionKey: "reports" },
  { label: "Staff", path: ROUTES.staff, icon: <PeopleOutlined />, permissionKey: "staff" },
];

type Props = {
  drawerWidth: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: collapsed ? 1 : 2,
        py: 2.5,
        transition: "padding 0.3s ease",
      }}
    >
      <Box
        component="img"
        src="/images/soundhublogo.png"
        alt="SoundHub"
        sx={{
          height: collapsed ? 32 : 40,
          transition: "height 0.3s ease",
          width: "auto",
        }}
      />

    </Box>
  );
}

function NavItems({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const permissions = useAuthStore((s) => s.user?.permissions ?? {});

  const visibleItems = navigationItems.filter((item) => {
    if (!item.permissionKey) return true;
    return permissions[item.permissionKey]?.view === true;
  });

  return (
    <List sx={{ px: 1.5, py: 2, flex: 1 }}>
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.path;

        const button = (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={isActive}
            onClick={onClose}
            sx={{
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-selected": {
                bgcolor: "rgba(247, 0, 0, 0.06)",
                color: "primary.main",
                "&:hover": { bgcolor: "rgba(247, 0, 0, 0.1)" },
                "& .MuiListItemIcon-root": { color: "primary.main" },
              },
              borderRadius: 1.5,
              justifyContent: collapsed ? "center" : "flex-start",
              mb: 0.5,
              minHeight: 44,
              px: collapsed ? 1 : 1.5,
            }}
          >
            <ListItemIcon
              sx={{ justifyContent: "center", minWidth: collapsed ? 0 : 40 }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            )}
          </ListItemButton>
        );

        return collapsed ? (
          <Tooltip key={item.path} title={item.label} placement="right" arrow>
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </List>
  );
}

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <List sx={{ pb: 2, px: 1.5, pt: 1 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          "&:hover": { bgcolor: "action.hover" },
          borderRadius: 1.5,
          justifyContent: collapsed ? "center" : "flex-start",
          minHeight: 44,
          px: collapsed ? 1 : 1.5,
        }}
      >
        <ListItemIcon
          sx={{ justifyContent: "center", minWidth: collapsed ? 0 : 40 }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary="Collapse"
            primaryTypographyProps={{ fontSize: "0.875rem" }}
          />
        )}
      </ListItemButton>
    </List>
  );
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const logout = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // Proceed with local logout even if API call fails
    }
    logout();
    navigate(ROUTES.login);
  }

  return (
    <>
      <List sx={{ px: 1.5, pb: 2, pt: 1 }}>
        <ListItemButton
          onClick={() => setConfirmOpen(true)}
          disabled={loggingOut}          sx={{
            "&:hover": { bgcolor: "rgba(247, 0, 0, 0.04)" },
            borderRadius: 1.5,
            color: "text.secondary",
            justifyContent: collapsed ? "center" : "flex-start",
            minHeight: 44,
            px: collapsed ? 1 : 1.5,
          }}
        >
          <ListItemIcon
            sx={{
              justifyContent: "center",
              minWidth: collapsed ? 0 : 40,
              color: "inherit",
            }}
          >
            <LogoutOutlined />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "0.875rem" }}
            />
          )}
        </ListItemButton>
      </List>

      <Dialog open={confirmOpen} onClose={loggingOut ? undefined : () => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loggingOut}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <CircularProgress size={18} color="inherit" /> : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function Sidebar({
  collapsed,
  drawerWidth,
  mobileOpen,
  onClose,
  onToggle,
}: Props) {
  const paperSx = {
    borderRight: "1px solid",
    borderColor: "divider",
    transition: "width 0.3s ease",
    width: drawerWidth,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
  };

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: 0,
        transition: "width 0.3s ease",
        width: { xs: 0, md: drawerWidth },
      }}
    >
      <Drawer
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        onClose={onClose}
        open={mobileOpen}
        sx={{ display: { xs: "block", md: "none" } }}
        slotProps={{ paper: { sx: { width: collapsed ? 72 : 260, display: "flex", flexDirection: "column", height: "100vh", transition: "width 0.3s ease" } } }}
      >
        <SidebarLogo collapsed={collapsed} />
        <NavItems collapsed={collapsed} onClose={onClose} />
        <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
        <LogoutButton collapsed={collapsed} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: "none", md: "block" } }}
        slotProps={{ paper: { sx: paperSx } }}
      >
        <SidebarLogo collapsed={collapsed} />
        <NavItems collapsed={collapsed} onClose={onClose} />
        <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
        <LogoutButton collapsed={collapsed} />
      </Drawer>
    </Box>
  );
}
