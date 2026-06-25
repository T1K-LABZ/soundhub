import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Typography,
} from "@mui/material";
import { MOVEMENT_TYPE_HEX } from "./inventory.constants";
import type { StockMovement } from "./inventory.types";
import { formatDateTime, formatKsh } from "./inventory.utils";

type Props = {
  movement: StockMovement;
  expanded: boolean;
  onToggle: () => void;
  onArriveClick: (movement: StockMovement) => void;
};

export function InventoryMovementCard({
  movement,
  expanded,
  onToggle,
  onArriveClick,
}: Props) {
  const color = MOVEMENT_TYPE_HEX[movement.movementType];

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 1 },
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header: Product + Quantity + Expand icon */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {movement.productName}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {movement.brand} • {movement.serial}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color={movement.quantity > 0 ? "success.main" : "error.main"}
            >
              {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
            </Typography>
            {expanded ? (
              <ExpandLessOutlined fontSize="small" color="action" />
            ) : (
              <ExpandMoreOutlined fontSize="small" color="action" />
            )}
          </Box>
        </Box>

        {/* Chips row */}
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
          <Chip
            label={movement.movementType}
            size="small"
            sx={{
              bgcolor: `${color}18`,
              color,
              fontWeight: 600,
              border: `1px solid ${color}40`,
              fontSize: "0.7rem",
              height: 22,
            }}
          />
          <Chip
            label={movement.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 22 }}
          />
        </Box>

        {/* Quick details */}
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Date
            </Typography>
            <Typography variant="caption">{formatDateTime(movement.dateTime)}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Staff
            </Typography>
            <Typography variant="caption">{movement.staff}</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Balance
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {movement.runningBalance}
            </Typography>
          </Box>
        </Box>

        {/* Expanded details */}
        <Collapse in={expanded} unmountOnExit>
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "background.default",
              borderRadius: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Product
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {movement.productName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Category
                </Typography>
                <Typography variant="body2">{movement.category}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Serial No.
                </Typography>
                <Typography variant="body2">{movement.serial}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Brand
                </Typography>
                <Typography variant="body2">{movement.brand}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Reason / Note
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {movement.reason}
              </Typography>
            </Box>

            {movement.supplier && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Supplier
                </Typography>
                <Typography variant="body2">{movement.supplier}</Typography>
              </Box>
            )}

            {movement.customerRef && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Customer Reference
                </Typography>
                <Typography variant="body2">{movement.customerRef}</Typography>
              </Box>
            )}

            {movement.condition && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Condition
                </Typography>
                <Typography variant="body2">{movement.condition}</Typography>
              </Box>
            )}

            {movement.movementType === "Incoming" && (
              <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                {movement.trackingRef && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Tracking Ref
                    </Typography>
                    <Typography variant="body2">{movement.trackingRef}</Typography>
                  </Box>
                )}
                {movement.expectedDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Expected Date
                    </Typography>
                    <Typography variant="body2">{movement.expectedDate}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Arrive button for incoming - outside collapse so always visible */}
        {movement.movementType === "Incoming" && (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<LocalShippingOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onArriveClick(movement);
            }}
            fullWidth
            sx={{ mt: 1.5 }}
          >
            Mark as Arrived
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
