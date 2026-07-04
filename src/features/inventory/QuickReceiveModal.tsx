import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Product } from "../products/products.types";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string, quantity: number) => void;
};

export function QuickReceiveModal({ open, product, onClose, onConfirm }: Props) {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    if (!product || quantity <= 0) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm(product.id, quantity);
      setLoading(false);
      handleClose();
    }, 500);
  }

  function handleClose() {
    setQuantity(0);
    setLoading(false);
    onClose();
  }

  if (!product) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Receive Stock</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Current stock: {product.stockQuantity} units
            </Typography>
          </Box>

          <TextField
            label="Quantity Received"
            type="number"
            value={quantity || ""}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            required
            autoFocus
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          disabled={quantity <= 0 || loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
          {loading ? "Receiving..." : `Receive ${quantity} Units`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
