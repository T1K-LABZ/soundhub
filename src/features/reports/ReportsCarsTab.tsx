import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Job } from "../sales/sales.types";
import { buildCarStats } from "./reports.data";
import { formatKsh } from "./reports.utils";

type Props = { jobs: Job[] };

const CAR_MAKE_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ec4899",
  "#94a3b8",
  "#ef4444",
  "#06b6d4",
];

export function ReportsCarsTab({ jobs }: Props) {
  const carStats = buildCarStats(jobs);

  const uniquePlates = new Set(jobs.map((j) => j.carPlate)).size;
  const makeSet = new Set(jobs.map((j) => j.carMake));

  const makeMap: Record<string, number> = {};
  for (const j of jobs) {
    makeMap[j.carMake] = (makeMap[j.carMake] ?? 0) + 1;
  }
  const makePieData = Object.entries(makeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const top5 = carStats.slice(0, 5);

  return (
    <Box>
      {/* 3 stat cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 160,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Unique Cars Serviced
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {uniquePlates}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              different plates
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 160,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Car Makes
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {makeSet.size}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              different brands
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 160,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Most Common Make
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {makePieData[0]?.name ?? "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {makePieData[0]?.value ?? 0} jobs
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Pie chart + top car models as cards */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: "1 1 38%",
            minWidth: 240,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Jobs by Car Make
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={makePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {makePieData.map((e, i) => (
                    <Cell
                      key={e.name}
                      fill={CAR_MAKE_COLORS[i % CAR_MAKE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Box sx={{ flex: "1 1 55%", minWidth: 280 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Top Car Models
          </Typography>
          <Grid container spacing={2}>
            {top5.map((c) => (
              <Grid key={`${c.carMake}-${c.carModel}-${c.carVariant}`} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        #{c.rank}
                      </Typography>
                      <Typography variant="caption" fontWeight={700}>
                        {c.jobsCount} jobs
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                      {c.carMake} {c.carModel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                      {c.carVariant}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Top Service</Typography>
                      <Typography variant="caption" fontWeight={600}>{c.mostCommonService}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary">Avg Spend</Typography>
                      <Typography variant="caption" fontWeight={700}>{formatKsh(c.avgSpend)}</Typography>
                    </Box>
                    {c.issuesCount > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Issues</Typography>
                        <Typography variant="caption" fontWeight={700} color="#D97706">{c.issuesCount}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
