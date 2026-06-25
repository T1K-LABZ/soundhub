import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SendOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import { daysSinceVisit, formatDate, formatKsh } from "./customers.utils";

type Props = {
  customers: Customer[];
  onSendOffer: (c: Customer) => void;
  onBulkWinback: () => void;
};

export function InactiveCustomersPanel({
  customers,
  onSendOffer,
  onBulkWinback,
}: Props) {
  const [open, setOpen] = useState(true);

  const inactive = customers
    .filter((c) => daysSinceVisit(c.lastVisit) >= 180)
    .sort((a, b) => daysSinceVisit(b.lastVisit) - daysSinceVisit(a.lastVisit));

  if (inactive.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ mt: 3, borderColor: "#DC2626" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          flexWrap: "wrap",
          gap: 1,
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberOutlined sx={{ color: "#DC2626" }} fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700} color="error">
            Inactive — {inactive.length}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<SendOutlined />}
            onClick={onBulkWinback}
          >
            Win-back
          </Button>
          <IconButton size="small">
            {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {inactive.map((c) => {
            const tier = deriveCustomerTier(c);
            const tc = TIER_COLOR[tier];
            const days = daysSinceVisit(c.lastVisit);
            return (
              <Card key={c.id} variant="outlined">
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {c.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.phone} • {c.vehicles.map((v) => v.plate).join(", ")}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${days}d inactive`}
                      size="small"
                      color="error"
                      sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Last visit: {formatDate(c.lastVisit)} • Spent: {formatKsh(c.totalSpent)}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<SendOutlined />}
                      onClick={() => onSendOffer(c)}
                    >
                      Win-back
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Collapse>
    </Paper>
  );
}
