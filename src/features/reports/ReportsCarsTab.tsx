import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

  // Total unique cars (by plate)
  const uniquePlates = new Set(jobs.map((j) => j.carPlate)).size;
  // Total car makes
  const makeSet = new Set(jobs.map((j) => j.carMake));

  // Make distribution for pie
  const makeMap: Record<string, number> = {};
  for (const j of jobs) {
    makeMap[j.carMake] = (makeMap[j.carMake] ?? 0) + 1;
  }
  const makePieData = Object.entries(makeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top 5 cars by jobs count
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

      {/* Pie chart + top models table */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Car make pie */}
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

        {/* Top car models table */}
        <Card
          sx={{
            flex: "1 1 55%",
            minWidth: 280,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Top Car Models
              </Typography>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    {[
                      "#",
                      "Make",
                      "Model",
                      "Variant",
                      "Jobs",
                      "Top Service",
                      "Avg Spend",
                      "Issues",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 600,
                          fontSize: 11,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {top5.map((c) => (
                    <TableRow
                      key={`${c.carMake}-${c.carModel}-${c.carVariant}`}
                      hover
                    >
                      <TableCell sx={{ fontSize: 11, fontWeight: 700 }}>
                        {c.rank}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{c.carMake}</TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{c.carModel}</TableCell>
                      <TableCell sx={{ fontSize: 11, color: "text.secondary" }}>
                        {c.carVariant}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 700 }}>
                        {c.jobsCount}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>
                        {c.mostCommonService}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>
                        {formatKsh(c.avgSpend)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 11,
                          color:
                            c.issuesCount > 0 ? "#D97706" : "text.secondary",
                        }}
                      >
                        {c.issuesCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
