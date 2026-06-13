import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SendOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

  // Inactive = no visit in 180+ days
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
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberOutlined sx={{ color: "#DC2626" }} fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700} color="error">
            Inactive Customers — {inactive.length} haven't visited in 6+ months
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
            Send Win-back Campaign
          </Button>
          <IconButton size="small">
            {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open}>
        <Divider />
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Cars</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell align="right">Days Inactive</TableCell>
              <TableCell align="right">Total Spent</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inactive.map((c) => {
              const tier = deriveCustomerTier(c);
              const tc = TIER_COLOR[tier];
              const days = daysSinceVisit(c.lastVisit);
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {c.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{c.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {c.vehicles.map((v) => v.plate).join(", ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tier}
                      size="small"
                      sx={{ bgcolor: `${tc}18`, color: tc, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatDate(c.lastVisit)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="error.main"
                    >
                      {days}d
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatKsh(c.totalSpent)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<SendOutlined />}
                      onClick={() => onSendOffer(c)}
                    >
                      Win-back
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Collapse>
    </Paper>
  );
}
