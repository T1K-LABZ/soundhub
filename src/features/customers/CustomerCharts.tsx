import { Box, Paper, Typography, useTheme } from "@mui/material";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_MONTHS, TIER_COLOR } from "./customers.constants";
import type { CustomerSummary } from "./customers.types";

type Props = {
  summary: CustomerSummary;
  totalByMonth: number[];
  newByMonth: number[];
};

function DonutCenter({ total }: { total: number }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.4em" fontSize={22} fontWeight={700} fill="#1e293b">
        {total}
      </tspan>
      <tspan x="50%" dy="1.4em" fontSize={11} fill="#64748b">
        customers
      </tspan>
    </text>
  );
}

export function CustomerCharts({ summary, totalByMonth, newByMonth }: Props) {
  const theme = useTheme();

  const lineData = CHART_MONTHS.map((m, i) => ({
    month: m,
    total: totalByMonth[i],
    new: newByMonth[i],
  }));

  const donutData = [
    {
      name: "New",
      value: summary.total - summary.regular - summary.loyal - summary.vip,
    },
    { name: "Regular", value: summary.regular },
    { name: "Loyal", value: summary.loyal },
    { name: "VIP", value: summary.vip },
  ].filter((d) => d.value > 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      {/* Growth line chart - full width */}
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Customer Growth
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={lineData}
            margin={{ top: 4, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.divider}
            />
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
            <Tooltip
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Customers"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="new"
              name="New This Month"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Tier donut - full width */}
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Customer Tiers
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={TIER_COLOR[entry.name as keyof typeof TIER_COLOR]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} customers`, name]}
                contentStyle={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => {
                  const d = donutData.find((x) => x.name === value);
                  const pct = d ? Math.round((d.value / summary.total) * 100) : 0;
                  return `${value} (${pct}%)`;
                }}
              />
              <DonutCenter total={summary.total} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
