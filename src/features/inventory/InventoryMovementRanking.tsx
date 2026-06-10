import { Box, Paper, Typography, useTheme } from "@mui/material";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_COLOR, CATEGORY_COLOR_DEFAULT } from "./inventory.constants";
import type { ProductMovementRank } from "./inventory.types";

type Props = {
  data: ProductMovementRank[];
};

// Custom Y-axis tick so the product short name fits cleanly
function ProductTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#64748b" fontSize={11}>
        {payload?.value}
      </text>
    </g>
  );
}

export function InventoryMovementRanking({ data }: Props) {
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          flex: "1 1 38%",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No movement data for this period
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5, flex: "1 1 38%", minWidth: 0 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Product Movement Ranking
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={110}
            tick={ProductTick as React.FC}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
            formatter={(value: number, _name: string, props) => [
              `${value} units`,
              props.payload.productName,
            ]}
          />
          <Bar dataKey="totalMoved" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell
                key={entry.productName}
                fill={CATEGORY_COLOR[entry.category] ?? CATEGORY_COLOR_DEFAULT}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
