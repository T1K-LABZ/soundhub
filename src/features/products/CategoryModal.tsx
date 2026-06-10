import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
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
import { useState } from "react";
import type { Category } from "./products.types";

type Props = {
  open: boolean;
  categories: Category[];
  onAdd: (category: Category) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function CategoryModal({
  open,
  categories,
  onAdd,
  onDelete,
  onClose,
}: Props) {
  const [name, setName] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) return;
    onAdd({ id: `cat-${Date.now()}`, name: trimmed });
    setName("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  function handleClose() {
    setName("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>

      <DialogContent dividers>
        {/* Add new category */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            autoFocus
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!name.trim()}
            startIcon={<AddOutlined />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Existing categories */}
        {categories.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 2 }}
          >
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
                  <Tooltip title="Delete category">
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => onDelete(cat.id)}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText primary={cat.name} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
