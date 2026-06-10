import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const DRAWER_WIDTH = 260;

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/*
        Sidebar renders:
        - a <Box component="nav"> that is 0px wide on mobile, 260px wide on desktop
          — this reserves space in the flex row for the permanent drawer
        - a temporary Drawer (mobile) + permanent Drawer (desktop) inside it
      */}
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Content column — naturally fills the remaining flex space */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Topbar
          drawerWidth={DRAWER_WIDTH}
          onMenuClick={() => setMobileOpen((v) => !v)}
        />
        <Box component="main" sx={{ p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
