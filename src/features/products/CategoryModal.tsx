import {
  AddOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./products.api";
import type { CategoryApiResponse } from "./products.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CategoryModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId);

  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data } = await getCategories(storeId);
      setCategories(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (open) {
      fetchCategories();
      setNewName("");
      setError(null);
    }
  }, [open, fetchCategories]);

  async function handleAdd() {
    if (!storeId || !newName.trim()) return;
    const trimmed = newName.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Category already exists.");
      return;
    }

    setAdding(true);
    setError(null);
    try {
      const created = await createCategory(storeId, trimmed);
      setCategories((prev) => [...prev, created]);
      setNewName("");
    } catch {
      setError("Failed to create category.");
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!storeId || !editName.trim()) return;
    const trimmed = editName.trim();

    try {
      const updated = await updateCategory(id, storeId, trimmed);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c)),
      );
      setEditingId(null);
    } catch {
      setError("Failed to update category.");
    }
  }

  async function handleDelete(id: string) {
    if (!storeId) return;
    try {
      await deleteCategory(id, storeId);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Cannot delete category that has products.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, action: "add" | "edit", id?: string) {
    if (e.key === "Enter") {
      if (action === "add") handleAdd();
      else if (id) handleUpdate(id);
    }
    if (e.key === "Escape" && action === "edit") {
      setEditingId(null);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Add new category */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "add")}
            fullWidth
            size="small"
            autoFocus
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!newName.trim() || adding}
            startIcon={adding ? <CircularProgress size={16} color="inherit" /> : <AddOutlined />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Existing categories */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            No categories yet
          </Typography>
        ) : (
          <List disablePadding>
            {categories.map((cat) => (
              <ListItem
                key={cat.id}
                disablePadding
                sx={{ py: 0.5 }}
                secondaryAction={
                  editingId === cat.id ? (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleUpdate(cat.id)}>
                        <CheckOutlined fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setEditingId(null)}>
                        <CloseOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                }
              >
                {editingId === cat.id ? (
                  <TextField
                    size="small"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "edit", cat.id)}
                    autoFocus
                    sx={{ flex: 1 }}
                  />
                ) : (
                  <ListItemText
                    primary={cat.name}
                    secondary={cat._count?.products ? `${cat._count.products} products` : undefined}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
