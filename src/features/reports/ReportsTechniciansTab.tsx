import {
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TechnicianStat } from "./reports.types";
import { formatKsh } from "./reports.utils";

type Props = { techStats: TechnicianStat[] };

const TECH_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"];

function TechnicianCard({
  stat,
  color,
}: {
  stat: TechnicianStat;
  color: string;
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        borderTop: `3px solid ${color}`,
        minWidth: 160,
        flex: "1 1 160px",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Avatar circle */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: color + "33",
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            mb: 1,
          }}
        >
          {stat.name.charAt(0)}
        </Box>

        <Typography variant="subtitle2" fontWeight={700}>
          {stat.name}
        </Typography>

        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Jobs done
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {stat.jobsCompleted}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Revenue
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {formatKsh(stat.revenue)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Avg value
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {formatKsh(stat.avgJobValue)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Follow-ups
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color={stat.followUpRate > 30 ? "#D97706" : "text.primary"}
            >
              {stat.followUpRate}%
            </Typography>
          </Box>
        </Box>

        <Chip
          label={stat.topService}
          size="small"
          sx={{
            mt: 1.5,
            fontSize: 10,
            height: 18,
            bgcolor: color + "22",
            color: color,
          }}
        />
      </CardContent>
    </Card>
  );
}

export function ReportsTechniciansTab({ techStats }: Props) {
  // Data for grouped bar chart
  const barData = techStats.map((t) => ({
    name: t.name,
    "Jobs Completed": t.jobsCompleted,
    // Normalise revenue to thousands for readability on shared axis
    "Revenue (K)": Math.round(t.revenue / 1000),
  }));

  return (
    <Box>
      {/* Technician cards row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {techStats.map((stat, i) => (
          <TechnicianCard
            key={stat.name}
            stat={stat}
            color={TECH_COLORS[i % TECH_COLORS.length]}
          />
        ))}
      </Box>

      {/* Grouped bar chart */}
      <Card
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Jobs & Revenue Comparison
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="Jobs Completed"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="Revenue (K)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Technician detail table */}
      <Card
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Technician Summary
            </Typography>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  {[
                    "Technician",
                    "Jobs Done",
                    "Total Revenue",
                    "Avg Job Value",
                    "Follow-up Rate",
                    "Top Service",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {techStats.map((t, i) => (
                  <TableRow key={t.name} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: TECH_COLORS[i % TECH_COLORS.length] + "33",
                            color: TECH_COLORS[i % TECH_COLORS.length],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {t.name.charAt(0)}
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {t.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                      {t.jobsCompleted}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {formatKsh(t.revenue)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {formatKsh(t.avgJobValue)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${t.followUpRate}%`}
                        size="small"
                        sx={{
                          fontSize: 11,
                          height: 20,
                          bgcolor: t.followUpRate > 30 ? "#fef3c7" : "#dcfce7",
                          color: t.followUpRate > 30 ? "#D97706" : "#16A34A",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{t.topService}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
