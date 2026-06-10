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
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { FaultRecord } from "./reports.types";
import { ACTION_COLOR } from "./reports.constants";
import { formatKsh } from "./reports.utils";

type Props = { faults: FaultRecord[] };

export function ReportsFaultsTab({ faults }: Props) {
  // KPI calculations
  const writtenOff = faults.filter((f) => f.actionTaken === "Written Off");
  const totalValueLost = faults.reduce((s, f) => s + f.valueLost, 0);

  // Most faulty brand
  const brandCount: Record<string, number> = {};
  for (const f of faults) {
    brandCount[f.brand] = (brandCount[f.brand] ?? 0) + 1;
  }
  const mostFaultyBrand =
    Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Fault rate by brand (horizontal bar)
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

      {/* Fault log table + bar chart row */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Fault log table */}
        <Card
          sx={{
            flex: "1 1 60%",
            minWidth: 300,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Fault Log
              </Typography>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    {[
                      "Date",
                      "Product",
                      "Brand",
                      "Qty",
                      "Fault",
                      "Action",
                      "Value Lost",
                      "Logged By",
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
                  {faults.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell sx={{ fontSize: 11 }}>{f.date}</TableCell>
                      <TableCell sx={{ fontSize: 11, maxWidth: 160 }}>
                        {f.productName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{f.brand}</TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>
                        {f.quantity}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, maxWidth: 180 }}>
                        {f.faultDescription}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={f.actionTaken}
                          size="small"
                          sx={{
                            fontSize: 10,
                            height: 18,
                            bgcolor: ACTION_COLOR[f.actionTaken] + "22",
                            color: ACTION_COLOR[f.actionTaken],
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}
                      >
                        {formatKsh(f.valueLost)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{f.loggedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>

        {/* Fault rate by brand bar chart */}
        <Card
          sx={{
            flex: "1 1 32%",
            minWidth: 220,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
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
