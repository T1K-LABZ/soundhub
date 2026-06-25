import {
  EditOutlined,
  SendOutlined,
  VisibilityOutlined,
  WhatsApp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import { formatDate, formatKsh, getInitials } from "./customers.utils";

type Props = {
  customer: Customer;
  onView: () => void;
  onSendOffer: () => void;
  onEdit: () => void;
};

export function CustomerListCard({ customer, onView, onSendOffer, onEdit }: Props) {
  const tier = deriveCustomerTier(customer);
  const tc = TIER_COLOR[tier];

  return (
    <Card
      variant="outlined"
      sx={{ transition: "box-shadow 0.2s", "&:hover": { boxShadow: 1 } }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header: Avatar + Name + Tier */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: `${tc}22`,
              color: tc,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {getInitials(customer.fullName)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {customer.fullName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <WhatsApp sx={{ fontSize: 12, color: "#25D366" }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {customer.phone}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={tier}
            size="small"
            sx={{ bgcolor: `${tc}18`, color: tc, fontWeight: 600, fontSize: "0.7rem", height: 22 }}
          />
        </Box>

        {/* Details row */}
        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Location
            </Typography>
            <Typography variant="caption" noWrap display="block">
              {customer.location}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Vehicles
            </Typography>
            <Typography variant="caption" noWrap display="block">
              {customer.vehicles.length} vehicle{customer.vehicles.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Last Visit
            </Typography>
            <Typography variant="caption">{formatDate(customer.lastVisit)}</Typography>
          </Box>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1.5, py: 1, bgcolor: "background.default", borderRadius: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" fontWeight={700}>{customer.totalVisits}</Typography>
            <Typography variant="caption" color="text.secondary">Visits</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" fontWeight={700}>{formatKsh(customer.totalSpent)}</Typography>
            <Typography variant="caption" color="text.secondary">Spent</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" fontWeight={700}>{customer.loyaltyPoints.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">Points</Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="View Profile">
            <IconButton size="small" onClick={onView}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Offer">
            <IconButton size="small" onClick={onSendOffer}>
              <SendOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
