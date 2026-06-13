import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MONTH_LABELS, TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import {
  formatDate,
  formatKsh,
  getInitials,
  visitsToNextTier,
} from "./customers.utils";

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
};

// Tier thresholds for progress bar
const TIER_MAX: Record<string, number> = {
  New: 2,
  Regular: 6,
  Loyal: 10,
  VIP: 10,
};

// Dummy per-month visits for chart (real app would come from job history)
const MONTHLY_VISITS = [1, 2, 1, 3, 2, 3];

export function CustomerProfileModal({ open, customer, onClose }: Props) {
  const [tab, setTab] = useState(0);
  if (!customer) return null;

  const tier = deriveCustomerTier(customer);
  const tc = TIER_COLOR[tier];
  const progress = Math.min((customer.totalVisits / TIER_MAX[tier]) * 100, 100);

  const visitData = MONTH_LABELS.map((m, i) => ({
    month: m,
    visits: MONTHLY_VISITS[i],
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 0 }}>Customer Profile</DialogTitle>

      <DialogContent dividers>
        {/* Header */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 120,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: `${tc}22`,
                color: tc,
                fontSize: 24,
                fontWeight: 700,
                mb: 1,
              }}
            >
              {getInitials(customer.fullName)}
            </Avatar>
            <Chip
              label={tier === "VIP" ? "👑 VIP" : tier}
              size="small"
              sx={{ bgcolor: `${tc}18`, color: tc, fontWeight: 700 }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700}>
              {customer.fullName}
            </Typography>
            <Typography variant="body2">
              {customer.phone} · {customer.email ?? "No email"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.location} · Member since{" "}
              {formatDate(customer.memberSince)}
            </Typography>

            {/* Tier progress */}
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                {visitsToNextTier(customer)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 0.5,
                  height: 6,
                  borderRadius: 1,
                  bgcolor: `${tc}22`,
                  "& .MuiLinearProgress-bar": { bgcolor: tc },
                }}
              />
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              ⭐ {customer.loyaltyPoints.toLocaleString()} loyalty points
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Vehicles & History" />
          <Tab label="Offers Sent" />
          <Tab label="Notes" />
        </Tabs>

        {/* Overview */}
        {tab === 0 && (
          <Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              {[
                {
                  label: "Total Visits",
                  value: customer.totalVisits.toString(),
                },
                { label: "Total Spent", value: formatKsh(customer.totalSpent) },
                {
                  label: "Avg Spend / Visit",
                  value: formatKsh(
                    Math.round(
                      customer.totalSpent / (customer.totalVisits || 1),
                    ),
                  ),
                },
                { label: "Last Visit", value: formatDate(customer.lastVisit) },
              ].map((s) => (
                <Paper
                  key={s.label}
                  variant="outlined"
                  sx={{ p: 1.5, flex: "1 1 130px", textAlign: "center" }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Visits per Month
            </Typography>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={visitData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Bar dataKey="visits" fill={tc} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Vehicles */}
        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {customer.vehicles.map((v) => (
              <Paper key={v.id} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {v.plate}
                </Typography>
                <Typography variant="body2">
                  {v.make} {v.model} {v.variant} — {v.year}
                </Typography>
                {v.color && (
                  <Typography variant="caption" color="text.secondary">
                    Color: {v.color}
                  </Typography>
                )}
              </Paper>
            ))}
            {customer.vehicles.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No vehicles on record.
              </Typography>
            )}
          </Box>
        )}

        {/* Offers */}
        {tab === 2 && (
          <Box>
            {customer.offersHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No offers sent yet.
              </Typography>
            ) : (
              customer.offersHistory.map((o) => (
                <Box
                  key={o.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 1.5,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 90 }}
                  >
                    {formatDate(o.dateSent)}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {o.title}
                  </Typography>
                  <Chip
                    label={o.status}
                    size="small"
                    sx={{
                      bgcolor:
                        o.status === "Redeemed"
                          ? "#16A34A18"
                          : o.status === "Opened"
                            ? "#2563EB18"
                            : "#94a3b818",
                      color:
                        o.status === "Redeemed"
                          ? "#16A34A"
                          : o.status === "Opened"
                            ? "#2563EB"
                            : "#64748b",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))
            )}
          </Box>
        )}

        {/* Notes */}
        {tab === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {customer.customerNotes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No notes yet.
              </Typography>
            ) : (
              customer.customerNotes
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map((n) => (
                  <Paper
                    key={n.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderLeft: n.pinned ? "3px solid #f59e0b" : undefined,
                    }}
                  >
                    {n.pinned && (
                      <Typography
                        variant="caption"
                        color="warning.main"
                        fontWeight={700}
                      >
                        📌 Pinned
                      </Typography>
                    )}
                    <Typography variant="body2">{n.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {n.addedBy} · {formatDate(n.date)}
                    </Typography>
                  </Paper>
                ))
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
