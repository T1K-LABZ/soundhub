import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { createRole, deleteRole, getRoles, updateRole } from "./staff.api";
import type { BackendRole, RolePermissions } from "./staff.types";

type Props = { open: boolean; onClose: () => void };

const MODULES = [
  "dashboard",
  "products",
  "inventory",
  "sales",
  "customers",
  "invoices",
  "expenses",
  "reports",
  "analytics",
  "shifts",
  "staff",
  "stores",
  "uploads",
  "mpesa",
] as const;

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  inventory: "Inventory",
  sales: "Sales",
  customers: "Customers",
  invoices: "Invoices",
  expenses: "Expenses",
  reports: "Reports",
  analytics: "Analytics",
  shifts: "Shifts",
  staff: "Staff",
  stores: "Stores",
  uploads: "Uploads",
  mpesa: "M-Pesa",
};

const EMPTY_PERMS: RolePermissions = Object.fromEntries(
  MODULES.map((m) => [m, { view: false, create: false, edit: false, delete: false }]),
) as RolePermissions;

export function ManageRolesModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId);

  const [roles, setRoles] = useState<BackendRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Create mode
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPerms, setNewPerms] = useState<RolePermissions>({ ...EMPTY_PERMS });

  const selected = roles.find((r) => r.id === selectedId);
  const isCreating = creating || selectedId === null;

  const fetchRoles = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await getRoles(storeId);
      setRoles(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (open) {
      fetchRoles();
      setCreating(false);
      setSelectedId(null);
      setNewName("");
      setNewPerms({ ...EMPTY_PERMS });
      setDirty(false);
    }
  }, [open, fetchRoles]);

  function handleSelectRole(id: string) {
    setCreating(false);
    setSelectedId(id);
    setDirty(false);
  }

  function handleCreateNew() {
    setCreating(true);
    setSelectedId(null);
    setNewName("");
    setNewPerms({ ...EMPTY_PERMS });
    setDirty(false);
  }

  function handleDelete(id: string) {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setCreating(false);
    }
  }

  // ── Perms editing for existing role ──
  const [editPerms, setEditPerms] = useState<RolePermissions>({});

  useEffect(() => {
    if (selected) {
      const merged = { ...EMPTY_PERMS, ...structuredClone(selected.permissions) };
      setEditPerms(merged);
    }
  }, [selected]);

  function toggleEditPerm(module: string, key: "view" | "create" | "edit" | "delete") {
    setEditPerms((prev) => ({
      ...prev,
      [module]: { ...prev[module], [key]: !prev[module]?.[key] },
    }));
    setDirty(true);
  }

  function toggleNewPerm(module: string, key: "view" | "create" | "edit" | "delete") {
    setNewPerms((prev) => ({
      ...prev,
      [module]: { ...prev[module], [key]: !prev[module]?.[key] },
    }));
    setDirty(true);
  }

  const activePerms = isCreating ? newPerms : editPerms;
  const activeToggle = isCreating ? toggleNewPerm : toggleEditPerm;

  async function handleSave() {
    if (!storeId) return;

    if (isCreating) {
      if (!newName.trim()) return;
      try {
        const created = await createRole({
          storeId,
          name: newName.trim(),
          permissions: newPerms,
        });
        setRoles((prev) => [...prev, created]);
        setSelectedId(created.id);
        setCreating(false);
        setNewName("");
        setDirty(false);
      } catch {
        // ignore
      }
    } else if (selected) {
      try {
        const updated = await updateRole(selected.id, {
          name: selected.name,
          permissions: editPerms,
        });
        setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setDirty(false);
      } catch {
        // ignore
      }
    }
  }

  async function handleDeleteRole() {
    if (!selected) return;
    try {
      await deleteRole(selected.id);
      handleDelete(selected.id);
    } catch {
      // ignore
    }
  }

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
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List dense disablePadding sx={{ flex: 1, overflow: "auto" }}>
                {roles.map((role) => (
                  <ListItemButton
                    key={role.id}
                    selected={selectedId === role.id && !creating}
                    onClick={() => handleSelectRole(role.id)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2">{role.name}</Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            )}

            <Divider />
            <Button
              startIcon={<AddOutlined />}
              onClick={handleCreateNew}
              sx={{ m: 1, textTransform: "none" }}
            >
              New Role
            </Button>
          </Box>

          {/* Right — permissions */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            {isCreating ? (
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Role name"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setDirty(true);
                  }}
                  size="small"
                  fullWidth
                  autoFocus
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Configure permissions for this new role
                </Typography>
              </Box>
            ) : selected ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Chip label={selected.name} size="small" sx={{ fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary">
                  Toggle permissions below
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" color="error" onClick={handleDeleteRole}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">
                  Select a role or create a new one
                </Typography>
              </Box>
            )}

            {(isCreating || selected) && (
              <Paper variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "background.default" }}>
                      <TableCell>Module</TableCell>
                      <TableCell align="center">View</TableCell>
                      <TableCell align="center">Create</TableCell>
                      <TableCell align="center">Edit</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MODULES.map((mod) => (
                      <TableRow key={mod}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {MODULE_LABELS[mod]}
                          </Typography>
                        </TableCell>
                        {(["view", "create", "edit", "delete"] as const).map(
                          (key) => (
                            <TableCell key={key} align="center">
                              <Switch
                                size="small"
                                checked={activePerms[mod]?.[key] ?? false}
                                onChange={() => activeToggle(mod, key)}
                                disabled={isCreating && !newName.trim()}
                              />
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!dirty || (isCreating && !newName.trim())}
        >
          {isCreating ? "Create Role" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
