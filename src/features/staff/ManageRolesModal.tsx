import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  DEFAULT_PERMISSIONS,
  PERMISSION_LEVELS,
  PERMISSION_PAGES,
  ROLE_COLOR,
} from "./staff.constants";
import type {
  PagePermissions,
  PermissionLevel,
  StaffRole,
} from "./staff.types";

type Props = { open: boolean; onClose: () => void };

const PAGE_LABELS: Record<(typeof PERMISSION_PAGES)[number], string> = {
  dashboard: "Dashboard",
  products: "Products",
  inventory: "Inventory",
  sales: "Sales",
  reports: "Reports",
  staff: "Staff",
  settings: "Settings",
};

const LEVEL_COLOR: Record<PermissionLevel, string> = {
  none: "#94a3b8",
  view: "#2563EB",
  add: "#16A34A",
  edit: "#D97706",
  delete: "#DC2626",
};

const ROLES: StaffRole[] = [
  "Owner",
  "Manager",
  "Senior Technician",
  "Junior Technician",
  "Sales Staff",
];

export function ManageRolesModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState<StaffRole>("Manager");
  const [perms, setPerms] = useState<Record<StaffRole, PagePermissions>>({
    ...DEFAULT_PERMISSIONS,
  });

  function setPermission(page: keyof PagePermissions, level: PermissionLevel) {
    setPerms((prev) => ({
      ...prev,
      [selected]: { ...prev[selected], [page]: level },
    }));
  }

  const current = perms[selected];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Manage Roles &amp; Permissions</DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ display: "flex", height: 480 }}>
          {/* Left — role list */}
          <Box
            sx={{
              width: 200,
              borderRight: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <List dense disablePadding>
              {ROLES.map((role) => (
                <ListItemButton
                  key={role}
                  selected={selected === role}
                  onClick={() => setSelected(role)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: ROLE_COLOR[role],
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2">{role}</Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Right — permissions matrix */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Chip
                label={selected}
                size="small"
                sx={{
                  bgcolor: `${ROLE_COLOR[selected]}18`,
                  color: ROLE_COLOR[selected],
                  fontWeight: 700,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Changes affect all staff with this role
              </Typography>
            </Box>

            <Paper variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "background.default" }}>
                    <TableCell>Page / Feature</TableCell>
                    <TableCell>Access Level</TableCell>
                    <TableCell>Visual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PERMISSION_PAGES.map((page) => {
                    const level = current[page];
                    return (
                      <TableRow key={page}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {PAGE_LABELS[page]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={level}
                            onChange={(e) =>
                              setPermission(
                                page,
                                e.target.value as PermissionLevel,
                              )
                            }
                            sx={{ minWidth: 100 }}
                          >
                            {PERMISSION_LEVELS.map((l) => (
                              <MenuItem key={l} value={l}>
                                {l.charAt(0).toUpperCase() + l.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={level}
                            size="small"
                            sx={{
                              bgcolor: `${LEVEL_COLOR[level]}22`,
                              color: LEVEL_COLOR[level],
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
