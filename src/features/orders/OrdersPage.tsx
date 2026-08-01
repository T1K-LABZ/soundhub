import {
  CancelOutlined,
  CheckCircleOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  PaymentOutlined,
  SearchOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Avatar,
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
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatKsh } from "../sales/sales.utils";
import { useOrdersQuery, useUpdateOrderStatus } from "./orders.api";
import type { Order, OrderStatus } from "./orders.types";

const STATUS_CONFIG: Record<string, { color: "default" | "warning" | "info" | "success" | "error"; label: string }> = {
  pending: { color: "warning", label: "Pending" },
  paid: { color: "info", label: "Paid" },
  processing: { color: "info", label: "Processing" },
  shipped: { color: "warning", label: "Shipped" },
  delivered: { color: "success", label: "Delivered" },
  cancelled: { color: "error", label: "Cancelled" },
};

const STATUS_OPTIONS = ["ALL", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export function OrdersPage() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const updateStatus = useUpdateOrderStatus();

  const { data: ordersData, isLoading } = useOrdersQuery(storeId, statusFilter !== "ALL" ? statusFilter : undefined, page + 1, pageSize);
  const orders = ordersData?.data ?? [];
  const total = ordersData?.meta?.total ?? orders.length;

  const isSearching = !!search;
  const filtered = orders.filter((o) =>
    !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerPhone.includes(search),
  );

  const paginated = isSearching ? filtered.slice(page * pageSize, page * pageSize + pageSize) : orders;
  const displayCount = isSearching ? filtered.length : total;

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    updateStatus.mutate({ orderId, status: newStatus });
    setViewOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
  }

  return (
    <Box sx={{ pb: { xs: 3, md: 4 } }}>
      <PageHeader
        subtitle="View and manage customer orders"
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {total.toLocaleString()} orders
            </Typography>
          </Box>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: 1.25,
          mb: 2,
        }}
      >
        <TextField
          placeholder="Search by name, phone, or order ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>{s === "ALL" ? "All Statuses" : STATUS_CONFIG[s]?.label ?? s}</MenuItem>
          ))}
        </TextField>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : displayCount === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Inventory2Outlined sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            No orders found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] ?? { color: "default" as const, label: order.status };
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "monospace" }}>
                          #{order.id.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{order.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.customerPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{order.products.length}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{formatKsh(order.totalAmount)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={cfg.label} color={cfg.color} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => setViewOrder(order)}>
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={displayCount}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </>
      )}

      {/* Order detail dialog */}
      <Dialog open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
        {viewOrder && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Order #{viewOrder.id.slice(-8).toUpperCase()}
              <Chip
                label={STATUS_CONFIG[viewOrder.status]?.label ?? viewOrder.status}
                color={STATUS_CONFIG[viewOrder.status]?.color ?? "default"}
                size="small"
              />
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">CUSTOMER</Typography>
                <Typography variant="body2" fontWeight={600}>{viewOrder.customerName}</Typography>
                <Typography variant="body2" color="text.secondary">{viewOrder.customerPhone}</Typography>
                {viewOrder.customerEmail && <Typography variant="body2" color="text.secondary">{viewOrder.customerEmail}</Typography>}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{viewOrder.deliveryAddress}</Typography>
              </Box>

              {viewOrder.notes && (
                <Box sx={{ mb: 2, bgcolor: "grey.50", borderRadius: 1, p: 1.5 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">NOTES</Typography>
                  <Typography variant="body2" color="text.secondary">{viewOrder.notes}</Typography>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={1}>ITEMS</Typography>
              {viewOrder.products.map((item) => (
                <Box key={item.productId} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: "grey.100" }}>
                    {item.productName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.productName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity} x {formatKsh(item.unitPrice)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>{formatKsh(item.lineTotal)}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight={700}>Total</Typography>
                <Typography variant="body2" fontWeight={700}>{formatKsh(viewOrder.totalAmount)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={1}>UPDATE STATUS</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {(["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                  <Chip
                    key={s}
                    label={STATUS_CONFIG[s]?.label ?? s}
                    color={STATUS_CONFIG[s]?.color ?? "default"}
                    variant={viewOrder.status === s ? "filled" : "outlined"}
                    onClick={() => handleStatusChange(viewOrder.id, s)}
                    clickable
                    disabled={updateStatus.isPending}
                    icon={
                      s === "delivered" ? <CheckCircleOutlined /> :
                      s === "cancelled" ? <CancelOutlined /> :
                      s === "shipped" ? <LocalShippingOutlined /> :
                      s === "paid" ? <PaymentOutlined /> : undefined
                    }
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewOrder(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
