import { Box, Paper, Typography, useTheme } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StockMovementPoint } from "./inventory.types";

type Props = {
  data: StockMovementPoint[];
};

export function InventoryStockChart({ data }: Props) {
  const theme = useTheme();

  return (
    <Paper variant="outlined" sx={{ p: 2.5, flex: "1 1 58%", minWidth: 0 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Stock Movement Overview
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 12, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            // Show a tick every N days depending on dataset length to avoid crowding
            interval={
              data.length > 30
                ? Math.floor(data.length / 10)
                : data.length > 10
                  ? 3
                  : 0
            }
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
            formatter={(value: number, name: string) => [
              value,
              name === "stockIn" ? "Stock In" : "Stock Out",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "stockIn" ? "Stock In" : "Stock Out"
            }
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
          {/* Stock In — amber */}
          <Line
            type="monotone"
            dataKey="stockIn"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#f59e0b" }}
            activeDot={{ r: 5 }}
          />
          {/* Stock Out — red */}
          <Line
            type="monotone"
            dataKey="stockOut"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#ef4444" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
