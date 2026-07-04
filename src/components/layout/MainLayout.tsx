import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 72;
const SIDEBAR_KEY = "sidebarCollapsed";

function loadCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "true";
  } catch {
    return false;
  }
}

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(loadCollapsed);

  function handleToggle() {
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={handleToggle}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Topbar
          drawerWidth={drawerWidth}
          onMenuClick={() => setMobileOpen((v) => !v)}
        />
        <Box component="main" sx={{ px: 3, py: 2, mt: 7 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
