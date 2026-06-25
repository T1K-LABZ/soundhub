import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { FaultRecord } from "./reports.types";
import { ACTION_COLOR } from "./reports.constants";
import { formatKsh } from "./reports.utils";

type Props = { faults: FaultRecord[] };

function FaultCard({ fault }: { fault: FaultRecord }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {fault.date}
          </Typography>
          <Chip
            label={fault.actionTaken}
            size="small"
            sx={{
              fontSize: 10,
              height: 18,
              bgcolor: ACTION_COLOR[fault.actionTaken] + "22",
              color: ACTION_COLOR[fault.actionTaken],
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={0.5} noWrap>
          {fault.productName}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {fault.brand} · Qty: {fault.quantity}
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" mb={1.5} noWrap>
          {fault.faultDescription}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {fault.loggedBy}
          </Typography>
          <Typography variant="caption" fontWeight={700} color="#DC2626">
            {formatKsh(fault.valueLost)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function ReportsFaultsTab({ faults }: Props) {
  const writtenOff = faults.filter((f) => f.actionTaken === "Written Off");
  const totalValueLost = faults.reduce((s, f) => s + f.valueLost, 0);

  const brandCount: Record<string, number> = {};
  for (const f of faults) {
    brandCount[f.brand] = (brandCount[f.brand] ?? 0) + 1;
  }
  const mostFaultyBrand =
    Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const brandFaultData = Object.entries(brandCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <Box>
      {/* KPI cards row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 180,
            borderRadius: 2,
            border: "1.5px solid #DC2626",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="#DC2626">
              Units Written Off
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#DC2626"
              sx={{ mt: 0.5 }}
            >
              {writtenOff.reduce((s, f) => s + f.quantity, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {writtenOff.length} fault records
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 180,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Total Value Lost
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#DC2626"
              sx={{ mt: 0.5 }}
            >
              {formatKsh(totalValueLost)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {faults.length} total records
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 28%",
            minWidth: 180,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Most Faulty Brand
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {mostFaultyBrand}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {brandCount[mostFaultyBrand] ?? 0} fault records
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Fault cards + bar chart */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 60%", minWidth: 300 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Fault Log
          </Typography>
          <Grid container spacing={2}>
            {faults.map((f) => (
              <Grid key={f.id} size={{ xs: 12, sm: 6 }}>
                <FaultCard fault={f} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Card
          sx={{
            flex: "1 1 32%",
            minWidth: 220,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            alignSelf: "flex-start",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Fault Rate by Brand
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={brandFaultData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={70}
                />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" name="Faults" radius={[0, 4, 4, 0]}>
                  {brandFaultData.map((e) => (
                    <Cell
                      key={e.name}
                      fill="#DC2626"
                      fillOpacity={
                        0.7 + 0.3 * (brandFaultData.indexOf(e) === 0 ? 1 : 0)
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
