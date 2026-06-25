import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { INVENTORY_PRODUCTS } from "./inventory.data";
import type { StockMovement } from "./inventory.types";

type Props = {
  open: boolean;
  incoming: StockMovement | null;
  onClose: () => void;
  onConfirm: (movementId: string, arrivedQuantity: number) => void;
};

export function ArriveStockModal({ open, incoming, onClose, onConfirm }: Props) {
  const [arrivedQuantity, setArrivedQuantity] = useState(0);
  const [notes, setNotes] = useState("");

  const product = INVENTORY_PRODUCTS.find(
    (p) => p.productName === incoming?.productName,
  );

  function handleSubmit() {
    if (!incoming) return;
    onConfirm(incoming.id, arrivedQuantity);
    handleClose();
  }

  function handleClose() {
    setArrivedQuantity(0);
    setNotes("");
    onClose();
  }

  if (!incoming) return null;

  const isValid = arrivedQuantity > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Stock as Arrived</DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}
      >
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            INCOMING ORDER DETAILS
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" fontWeight={600}>
                {incoming.productName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {incoming.brand} • {incoming.serial}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Ordered Quantity
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {incoming.quantity} units
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Tracking Ref
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {incoming.trackingRef || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Supplier
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {incoming.supplier || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Expected Date
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {incoming.expectedDate || "—"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            CONFIRM ARRIVAL
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quantity Received"
                type="number"
                value={arrivedQuantity || ""}
                onChange={(e) => setArrivedQuantity(Number(e.target.value))}
                fullWidth
                required
                size="small"
                slotProps={{ htmlInput: { min: 1, max: incoming.quantity } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="Any notes about the delivery condition..."
              />
            </Grid>
          </Grid>
        </Box>

        {product && arrivedQuantity > 0 && (
          <Box
            sx={{
              bgcolor: "action.hover",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Stock
              </Typography>
              <Typography variant="subtitle2" fontWeight={700}>
                {product.quantityOnHand} units
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                After Arrival
              </Typography>
              <Typography variant="subtitle2" fontWeight={700}>
                {product.quantityOnHand + arrivedQuantity} units
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Value Added
              </Typography>
              <Typography variant="subtitle2" fontWeight={700}>
                KSh{" "}
                {(arrivedQuantity * product.buyingPrice).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid}
          color="success"
        >
          Confirm Arrival
        </Button>
      </DialogActions>
    </Dialog>
  );
}
