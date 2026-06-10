import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import { ROUTES } from "../../router/routes";

type Props = {
  drawerWidth: number;
  onMenuClick: () => void;
};

export function Topbar({ drawerWidth, onMenuClick }: Props) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.login);
  }

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="fixed"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        // On desktop offset by the permanent sidebar; on mobile full width
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          // Only show hamburger on mobile — desktop has the permanent sidebar
          sx={{ mr: 1, display: { md: "none" } }}
          aria-label="Open navigation menu"
        >
          <MenuOutlined />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>

        <Button
          color="primary"
          onClick={handleLogout}
          startIcon={<LogoutOutlined />}
          variant="outlined"
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
