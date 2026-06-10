import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ROLE_COLOR } from "./staff.constants";
import type { StaffMember, StaffPerformance } from "./staff.types";
import { formatKsh, getInitials } from "./staff.utils";

type Props = {
  staff: StaffMember[];
  performances: StaffPerformance[];
};

function PodiumCard({
  emoji,
  label,
  name,
  value,
  color,
}: {
  emoji: string;
  label: string;
  name: string;
  value: string;
  color: string;
}) {
  return (
    <Card
      variant="outlined"
      sx={{ flex: 1, borderTop: `3px solid ${color}`, textAlign: "center" }}
    >
      <CardContent>
        <Typography fontSize={28}>{emoji}</Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function StaffPerformanceSection({ staff, performances }: Props) {
  const theme = useTheme();

  // Build chart data — one entry per staff member
  const chartData = staff.map((s) => {
    const perf = performances.find((p) => p.staffId === s.id);
    return {
      name: s.fullName.split(" ")[0], // first name only to keep chart clean
      fullName: s.fullName,
      jobs: perf?.jobsThisMonth ?? 0,
      revenue: Math.round((perf?.revenueThisMonth ?? 0) / 1000),
      color: ROLE_COLOR[s.role],
    };
  });

  // Leaderboard
  const byJobs = [...performances].sort(
    (a, b) => b.jobsThisMonth - a.jobsThisMonth,
  );
  const byRevenue = [...performances].sort(
    (a, b) => b.revenueThisMonth - a.revenueThisMonth,
  );

  const getName = (id: string) =>
    staff.find((s) => s.id === id)?.fullName ?? "—";

  return (
    <Paper variant="outlined" sx={{ mt: 4, p: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        Team Performance This Month
      </Typography>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Grouped bar chart */}
        <Box sx={{ flex: "1 1 420px", minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
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
                contentStyle={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                yAxisId="jobs"
                dataKey="jobs"
                name="Jobs"
                radius={[4, 4, 0, 0]}
                fill="#f59e0b"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.fullName} fill="#f59e0b" />
                ))}
              </Bar>
              <Bar
                yAxisId="rev"
                dataKey="revenue"
                name="Revenue (K)"
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Podium leaderboard */}
        <Box
          sx={{
            flex: "0 1 340px",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <PodiumCard
              emoji="🥇"
              label="Most Jobs"
              name={getName(byJobs[0]?.staffId)}
              value={`${byJobs[0]?.jobsThisMonth ?? 0} jobs`}
              color="#f59e0b"
            />
            <PodiumCard
              emoji="💰"
              label="Most Revenue"
              name={getName(byRevenue[0]?.staffId)}
              value={formatKsh(byRevenue[0]?.revenueThisMonth ?? 0)}
              color="#22c55e"
            />
          </Box>
          <PodiumCard
            emoji="⭐"
            label="Best Rating"
            name={getName(
              [...performances].sort((a, b) => b.avgRating - a.avgRating)[0]
                ?.staffId,
            )}
            value={`${[...performances].sort((a, b) => b.avgRating - a.avgRating)[0]?.avgRating.toFixed(1) ?? "—"} / 5`}
            color="#9333EA"
          />
        </Box>
      </Box>
    </Paper>
  );
}
