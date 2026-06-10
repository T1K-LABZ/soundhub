import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
import { MONTH_LABELS, ROLE_COLOR, STATUS_COLOR } from "./staff.constants";
import type { StaffMember, StaffPerformance } from "./staff.types";
import { formatKsh, getTenure, getInitials } from "./staff.utils";

type Props = {
  open: boolean;
  staff: StaffMember | null;
  performance: StaffPerformance | undefined;
  onClose: () => void;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", gap: 1, mb: 0.75 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ minWidth: 140 }}
      >
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export function ViewProfileModal({ open, staff, performance, onClose }: Props) {
  const [tab, setTab] = useState(0);
  if (!staff) return null;

  const roleColor = ROLE_COLOR[staff.role];
  const statusColor = STATUS_COLOR[staff.status];

  const monthlyChartData = MONTH_LABELS.map((m, i) => ({
    month: m,
    jobs: performance?.monthlyJobs[i] ?? 0,
    revenue: Math.round((performance?.monthlyRevenue[i] ?? 0) / 1000),
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 0 }}>Staff Profile</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* ── Left: profile info ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: `${roleColor}22`,
                  color: roleColor,
                  fontSize: 28,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {getInitials(staff.fullName)}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                {staff.fullName}
              </Typography>
              <Chip
                label={staff.role}
                size="small"
                sx={{
                  bgcolor: `${roleColor}18`,
                  color: roleColor,
                  fontWeight: 600,
                  mt: 0.5,
                }}
              />
              <Chip
                label={staff.status}
                size="small"
                sx={{
                  bgcolor: `${statusColor}18`,
                  color: statusColor,
                  fontWeight: 600,
                  mt: 0.5,
                }}
              />
            </Box>

            <Divider sx={{ mb: 1.5 }} />
            <InfoRow label="Phone" value={staff.phone} />
            <InfoRow label="Email" value={staff.email || "—"} />
            <InfoRow label="National ID" value={staff.nationalId || "—"} />
            <InfoRow label="Employment" value={staff.employmentType} />
            <InfoRow
              label="Specializations"
              value={staff.specializations.join(", ")}
            />
            <InfoRow label="Tenure" value={getTenure(staff.dateJoined)} />
            <InfoRow
              label="Emergency Contact"
              value={`${staff.emergencyContactName} — ${staff.emergencyContactPhone}`}
            />
            {staff.notes && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  Notes
                </Typography>
                <Typography variant="body2">{staff.notes}</Typography>
              </>
            )}
          </Grid>

          {/* ── Right: tabbed stats ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Overview" />
              <Tab label="Performance" />
            </Tabs>

            {/* Overview */}
            {tab === 0 && performance && (
              <>
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <StatBox
                      label="Jobs This Month"
                      value={performance.jobsThisMonth.toString()}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <StatBox
                      label="Revenue This Month"
                      value={formatKsh(performance.revenueThisMonth)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <StatBox
                      label="Total Jobs All Time"
                      value={performance.totalJobsAllTime.toString()}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <StatBox
                      label="Total Revenue All Time"
                      value={formatKsh(performance.totalRevenueAllTime)}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                  <Typography variant="body2">
                    ⭐ Avg Rating:{" "}
                    <strong>{performance.avgRating.toFixed(1)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    🔁 Follow-up Rate:{" "}
                    <strong>{performance.followUpRate}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    🔧 Most Common:{" "}
                    <strong>{performance.mostCommonService}</strong>
                  </Typography>
                </Box>
              </>
            )}

            {/* Performance charts */}
            {tab === 1 && performance && (
              <>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Jobs &amp; Revenue — Last 6 Months
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={monthlyChartData}
                    margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="jobs"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="rev"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      unit="k"
                    />
                    <Tooltip
                      formatter={(v, n) => [
                        v,
                        n === "jobs" ? "Jobs" : "Revenue (KES '000)",
                      ]}
                    />
                    <Bar
                      yAxisId="jobs"
                      dataKey="jobs"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      name="jobs"
                    />
                    <Bar
                      yAxisId="rev"
                      dataKey="revenue"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
