import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  LocalShippingOutlined,
  ScheduleOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDeleteBatch, useUpdateBatch } from "./inventory.api";
import type { BatchItem, BatchStatus } from "./inventory.api";
import { useAuthStore } from "../auth/auth.store";
import { formatKsh } from "../sales/sales.utils";

type Props = {
  batches: BatchItem[];
  onEdit?: (batch: BatchItem) => void;
};

const STATUS_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  IN_TRANSIT: { color: "#1565C0", label: "In Transit", bg: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" },
  PENDING: { color: "#E65100", label: "Pending", bg: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)" },
  ACTIVE: { color: "#2E7D32", label: "Active", bg: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)" },
};

export function BatchList({ batches, onEdit }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";

  if (batches.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <LocalShippingOutlined sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No batches found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} storeId={storeId} onEdit={onEdit} />
      ))}
    </Box>
  );
}

function BatchCard({ batch, storeId, onEdit }: { batch: BatchItem; storeId: string; onEdit?: (batch: BatchItem) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmActivateOpen, setConfirmActivateOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const updateBatch = useUpdateBatch(batch.id);
  const deleteBatch = useDeleteBatch();
  const statusCfg = STATUS_CONFIG[batch.status] || { color: "#9E9E9E", label: batch.status, bg: "#F5F5F5" };
  const buyingPrice = Number(batch.buyingPrice) || 0;
  const sellingPrice = Number(batch.sellingPrice) || 0;
  const margin = sellingPrice - buyingPrice;
  const canActivate = batch.status === "IN_TRANSIT" || batch.status === "PENDING";
  const isInTransit = batch.status === "IN_TRANSIT";

  function handleActivate() {
    if (isInTransit) {
      setConfirmActivateOpen(true);
    } else {
      updateBatch.mutate({ storeId, status: "ACTIVE" as BatchStatus });
    }
  }

  function handleConfirmActivate() {
    updateBatch.mutate(
      { storeId, status: "ACTIVE" as BatchStatus },
      { onSuccess: () => setConfirmActivateOpen(false) },
    );
  }

  function handleDelete() {
    deleteBatch.mutate(
      { batchId: batch.id, storeId },
      { onSuccess: () => setConfirmDeleteOpen(false) },
    );
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderLeft: "4px solid",
          borderColor: statusCfg.color,
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: 2 },
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          {/* Compact header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Product initial badge */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: statusCfg.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} color={statusCfg.color}>
                {(batch.product?.name || "?")[0]}
              </Typography>
            </Box>

            {/* Main info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {batch.product?.name || "Unknown Product"}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {batch.supplier} · {batch.quantityReceived.toLocaleString()} units
              </Typography>
            </Box>

            {/* Price + expand */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color={statusCfg.color}>
                {formatKsh(sellingPrice)}
              </Typography>
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
              </IconButton>
            </Box>
          </Box>

          {/* Expanded details */}
          <Collapse in={expanded} unmountOnExit>
            <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
              {/* Price breakdown card */}
              <Box
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  p: 1.5,
                  mb: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                  PRICING
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Buying Price</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatKsh(buyingPrice)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Selling Price</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatKsh(sellingPrice)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", pt: 0.5, borderTop: "1px dashed", borderColor: "divider" }}>
                  <Typography variant="body2" fontWeight={600}>Margin</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">{formatKsh(margin)}</Typography>
                </Box>
              </Box>

              {/* Details row */}
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
                <DetailChip
                  icon={<ScheduleOutlined />}
                  label={`Expected: ${new Date(batch.expectedDate).toLocaleDateString()}`}
                />
                {batch.receivedAt && (
                  <DetailChip
                    icon={<CheckCircleOutlined />}
                    label={`Received: ${new Date(batch.receivedAt).toLocaleDateString()}`}
                    color="success"
                  />
                )}
                {batch.trackingRef && (
                  <DetailChip label={`Track: ${batch.trackingRef}`} />
                )}
              </Box>

              {/* Notes */}
              {batch.notes && (
                <Box
                  sx={{
                    bgcolor: "grey.100",
                    borderRadius: 1.5,
                    p: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    NOTES
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {batch.notes}
                  </Typography>
                </Box>
              )}

              {/* Stock warning */}
              {batch.quantityRemaining < batch.quantityReceived && (
                <Alert severity="warning" sx={{ mb: 1.5, py: 0 }}>
                  {batch.quantityRemaining} of {batch.quantityReceived} units remaining
                </Alert>
              )}

              {/* Actions */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {canActivate && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleOutlined />}
                    onClick={handleActivate}
                    disabled={updateBatch.isPending}
                  >
                    Activate Stock
                  </Button>
                )}
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit?.(batch)}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "rgba(31, 41, 51, 0.04)",
                      "&:hover": { color: "primary.main", bgcolor: "rgba(247, 0, 0, 0.08)" },
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => setConfirmDeleteOpen(true)}
                    sx={{
                      width: 34,
                      height: 34,
                      color: "error.main",
                      bgcolor: "rgba(211, 47, 47, 0.06)",
                      "&:hover": { bgcolor: "rgba(211, 47, 47, 0.12)" },
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Activate confirmation dialog */}
      <Dialog open={confirmActivateOpen} onClose={() => setConfirmActivateOpen(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberOutlined color="warning" />
          Confirm Activation
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action is <strong>irreversible</strong>. Once activated, this stock cannot be returned to the supplier.
          </Alert>
          <Typography variant="body2" mb={1}>
            You are about to activate <strong>{batch.product?.name}</strong> ({batch.quantityReceived} units) from <strong>{batch.supplier}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The buying price ({formatKsh(buyingPrice)}) and selling price ({formatKsh(sellingPrice)}) will be applied as the default product prices.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmActivateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<CheckCircleOutlined />}
            onClick={handleConfirmActivate}
            disabled={updateBatch.isPending}
          >
            Yes, Activate Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberOutlined color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1}>
            Are you sure you want to delete this batch?
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {batch.product?.name} — {batch.supplier} ({batch.quantityReceived} units)
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}
            disabled={deleteBatch.isPending}
          >
            {deleteBatch.isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DetailChip({
  icon,
  label,
  color = "default",
}: {
  icon?: React.ReactNode;
  label: string;
  color?: "default" | "success";
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: color === "success" ? "success.light" : "grey.100",
        color: color === "success" ? "success.dark" : "text.secondary",
        borderRadius: 1,
        px: 1,
        py: 0.5,
      }}
    >
      {icon && <Box sx={{ display: "flex", "& svg": { fontSize: 14 } }}>{icon}</Box>}
      <Typography variant="caption" fontWeight={500}>{label}</Typography>
    </Box>
  );
}
