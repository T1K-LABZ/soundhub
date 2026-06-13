import {
  MoreVertOutlined,
  SendOutlined,
  VisibilityOutlined,
  WhatsApp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import {
  formatDate,
  formatKsh,
  getInitials,
  isBirthdayThisMonth,
} from "./customers.utils";

type Props = {
  customer: Customer;
  onView: () => void;
  onSendOffer: () => void;
  onEdit: () => void;
};

export function CustomerCard({ customer, onView, onSendOffer, onEdit }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const tier = deriveCustomerTier(customer);
  const tierColor = TIER_COLOR[tier];
  const birthday = isBirthdayThisMonth(customer.birthday);

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Tier badge — top right */}
      <Chip
        label={tier === "VIP" ? "👑 VIP" : tier}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bgcolor: `${tierColor}18`,
          color: tierColor,
          fontWeight: 700,
        }}
      />

      <CardContent sx={{ flex: 1, pb: 1 }}>
        {/* Avatar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 1.5,
            mt: 1,
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: `${tierColor}22`,
              color: tierColor,
              fontSize: 20,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {getInitials(customer.fullName)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700} textAlign="center">
            {customer.fullName}
            {birthday && <span style={{ marginLeft: 6 }}>🎂</span>}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <WhatsApp sx={{ fontSize: 14, color: "#25D366" }} />
            <Typography variant="body2" color="text.secondary">
              {customer.phone}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {customer.location}
          </Typography>
        </Box>

        {/* Vehicles */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          {customer.vehicles.slice(0, 2).map((v) => (
            <Chip
              key={v.id}
              label={`${v.plate} • ${v.make} ${v.model}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem" }}
            />
          ))}
          {customer.vehicles.length > 2 && (
            <Chip
              label={`+${customer.vehicles.length - 2} more`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem" }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Stats */}
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              {customer.totalVisits}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Visits
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" fontWeight={700}>
              {formatKsh(customer.totalSpent)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Spent
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" fontWeight={600}>
              {formatDate(customer.lastVisit)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Last Visit
            </Typography>
          </Box>
        </Box>

        {/* Loyalty points */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          mt={1}
        >
          ⭐ {customer.loyaltyPoints.toLocaleString()} loyalty points
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 1.5 }}>
        <Button
          size="small"
          startIcon={<VisibilityOutlined />}
          onClick={onView}
        >
          Profile
        </Button>
        <Button size="small" startIcon={<SendOutlined />} onClick={onSendOffer}>
          Offer
        </Button>
        <Tooltip title="More">
          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVertOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onEdit();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            Merge Duplicate
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}
