import { MenuOutlined } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../router/routes";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.products]: "Products",
  [ROUTES.inventory]: "Inventory",
  [ROUTES.sales]: "Sales",
  [ROUTES.customers]: "Customers",
  [ROUTES.invoices]: "Invoices",
  [ROUTES.reports]: "Reports",
  [ROUTES.staff]: "Staff",
};

type Props = {
  drawerWidth: number;
  onMenuClick: () => void;
};

export function Topbar({ drawerWidth, onMenuClick }: Props) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "SoundHub";

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="fixed"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: "none" } }}
          aria-label="Open navigation menu"
        >
          <MenuOutlined />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <Box
          component="img"
          src="/images/soundhublogo.png"
          alt="SoundHub"
          sx={{
            height: 28,
            display: { xs: "block", md: "none" },
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
