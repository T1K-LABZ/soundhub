import {
  CheckCircleOutlined,
  LocalShippingOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export type IncomingShipment = {
  id: string;
  supplier: string;
  expectedDate: string;
  trackingRef: string;
  items: { productName: string; quantity: number }[];
  status: "pending" | "arrived";
  createdBy: string;
};

type Props = {
  shipments: IncomingShipment[];
  onMarkArrived: (shipmentId: string) => void;
};

export function IncomingShipments({ shipments, onMarkArrived }: Props) {
  if (shipments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <LocalShippingOutlined sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No incoming shipments
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Supplier</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Expected</TableCell>
            <TableCell>Tracking</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {shipment.supplier}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  by {shipment.createdBy}
                </Typography>
              </TableCell>
              <TableCell>
                {shipment.items.map((item, idx) => (
                  <Typography key={idx} variant="caption" display="block">
                    {item.productName} x{item.quantity}
                  </Typography>
                ))}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ScheduleOutlined sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="caption">
                    {new Date(shipment.expectedDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {shipment.trackingRef || "-"}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={shipment.status === "arrived" ? "Arrived" : "Pending"}
                  color={shipment.status === "arrived" ? "success" : "warning"}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                {shipment.status === "pending" && (
                  <Button
                    size="small"
                    variant="text"
                    color="success"
                    onClick={() => onMarkArrived(shipment.id)}
                    sx={{ minWidth: 0, gap: 0.3, fontSize: "0.75rem" }}
                  >
                    <CheckCircleOutlined sx={{ fontSize: 16 }} /> Arrived
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
