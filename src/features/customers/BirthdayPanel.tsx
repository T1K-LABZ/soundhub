import { CakeOutlined, SendOutlined } from "@mui/icons-material";
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
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import { isBirthdayThisMonth } from "./customers.utils";

type Props = {
  customers: Customer[];
  onSendOffer: (c: Customer) => void;
};

export function BirthdayPanel({ customers, onSendOffer }: Props) {
  const [open, setOpen] = useState(true);

  const birthdays = customers.filter((c) => isBirthdayThisMonth(c.birthday));

  if (birthdays.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ mt: 3, borderColor: "#f59e0b" }}>
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
          <CakeOutlined sx={{ color: "#f59e0b" }} fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            🎂 Birthdays This Month — {birthdays.length} customer
            {birthdays.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <IconButton size="small">
          {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Divider />
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {birthdays.map((c) => {
              const tier = deriveCustomerTier(c);
              const tc = TIER_COLOR[tier];
              const bday = c.birthday
                ? new Date(c.birthday).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                  })
                : "—";
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
                    <Typography variant="body2">🎂 {bday}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tier}
                      size="small"
                      sx={{ bgcolor: `${tc}18`, color: tc, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<SendOutlined />}
                      onClick={() => onSendOffer(c)}
                    >
                      Send Birthday Offer
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
