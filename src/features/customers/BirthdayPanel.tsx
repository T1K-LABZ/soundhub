import { CakeOutlined, SendOutlined } from "@mui/icons-material";
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
            🎂 Birthdays This Month — {birthdays.length}
          </Typography>
        </Box>
        <IconButton size="small">
          {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
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
              <Card key={c.id} variant="outlined">
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {c.fullName} 🎂
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bday} • {c.phone}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<SendOutlined />}
                      onClick={() => onSendOffer(c)}
                    >
                      Send Offer
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
