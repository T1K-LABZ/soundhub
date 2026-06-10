import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { PaymentBreakdown, RevenuePoint } from "./reports.types";
import { formatKsh } from "./reports.utils";

type Props = {
  revenuePoints: RevenuePoint[];
  paymentBreakdown: PaymentBreakdown[];
};

// Custom label rendered in the center of the donut
function DonutCenterLabel({
  viewBox,
  total,
}: {
  viewBox?: { cx: number; cy: number };
  total: number;
}) {
  const { cx = 0, cy = 0 } = viewBox ?? {};
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.4em" fontSize={11} fill="#94a3b8">
        Total
      </tspan>
      <tspan x={cx} dy="1.4em" fontSize={13} fontWeight={700} fill="#f59e0b">
        {formatKsh(total)}
      </tspan>
    </text>
  );
}

function RevenueLineChart({ data }: { data: RevenuePoint[] }) {
  // Show at most 30 points for readability
  const visible = data.slice(-30);
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Revenue Trend
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={visible}>
            <defs>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.3}
            />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatKsh(value),
                name,
              ]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Area
              type="monotone"
              dataKey="total"
              name="Total Revenue"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#totalGrad)"
            />
            <Line
              type="monotone"
              dataKey="collected"
              name="Collected"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outstanding"
              name="Outstanding"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PaymentDonut({ data }: { data: PaymentBreakdown[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Payment Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              label={false}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
              {/* @ts-expect-error recharts label prop accepts custom component */}
              <DonutCenterLabel total={total} />
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatKsh(value)]}
              contentStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <Box sx={{ mt: 1 }}>
          {data.map((d) => (
            <Box
              key={d.status}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: d.color,
                  }}
                />
                <Typography variant="caption">{d.status}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {d.count} jobs · {formatKsh(d.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export function ReportsMainCharts({ revenuePoints, paymentBreakdown }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <Box sx={{ flex: "0 0 59%", minWidth: 280 }}>
        <RevenueLineChart data={revenuePoints} />
      </Box>
      <Box sx={{ flex: "1 1 38%", minWidth: 260 }}>
        <PaymentDonut data={paymentBreakdown} />
      </Box>
    </Box>
  );
}
