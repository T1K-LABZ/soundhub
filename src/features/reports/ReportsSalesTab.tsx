import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Job } from "../sales/sales.types";
import {
  SERVICE_TYPE_COLOR,
  PAYMENT_STATUS_COLOR,
} from "../sales/sales.constants";
import { formatKsh } from "./reports.utils";

type Props = { jobs: Job[] };

const PAYMENT_METHOD_COLOR: Record<string, string> = {
  Cash: "#22c55e",
  Mpesa: "#3b82f6",
  Card: "#a855f7",
  "Bank Transfer": "#f59e0b",
};

function ServiceTypeCharts({ jobs }: { jobs: Job[] }) {
  // Service type donut
  const svcMap: Record<string, number> = {};
  const svcRevMap: Record<string, number> = {};
  for (const j of jobs) {
    svcMap[j.serviceType] = (svcMap[j.serviceType] ?? 0) + 1;
    svcRevMap[j.serviceType] = (svcRevMap[j.serviceType] ?? 0) + j.grandTotal;
  }
  const svcData = Object.entries(svcMap).map(([name, value]) => ({
    name,
    value,
  }));
  const svcRevData = Object.entries(svcRevMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Payment method pie
  const pmMap: Record<string, number> = {};
  for (const j of jobs)
    pmMap[j.paymentMethod] = (pmMap[j.paymentMethod] ?? 0) + 1;
  const pmData = Object.entries(pmMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Service type donut */}
      <Card
        sx={{
          flex: "1 1 28%",
          minWidth: 220,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            By Service Type
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={svcData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
              >
                {svcData.map((e) => (
                  <Cell
                    key={e.name}
                    fill={
                      SERVICE_TYPE_COLOR[
                        e.name as keyof typeof SERVICE_TYPE_COLOR
                      ] ?? "#94a3b8"
                    }
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by service */}
      <Card
        sx={{
          flex: "1 1 38%",
          minWidth: 260,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Revenue by Service
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={svcRevData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                width={80}
              />
              <Tooltip
                formatter={(v: number) => formatKsh(v)}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]}>
                {svcRevData.map((e) => (
                  <Cell
                    key={e.name}
                    fill={
                      SERVICE_TYPE_COLOR[
                        e.name as keyof typeof SERVICE_TYPE_COLOR
                      ] ?? "#f59e0b"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment method pie */}
      <Card
        sx={{
          flex: "1 1 28%",
          minWidth: 220,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Payment Methods
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pmData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
              >
                {pmData.map((e) => (
                  <Cell
                    key={e.name}
                    fill={PAYMENT_METHOD_COLOR[e.name] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export function ReportsSalesTab({ jobs }: Props) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const paginated = jobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const totals = {
    grandTotal: jobs.reduce((s, j) => s + j.grandTotal, 0),
    paid: jobs.reduce(
      (s, j) =>
        s +
        (j.paymentStatus === "Paid" ? j.grandTotal : (j.depositAmount ?? 0)),
      0,
    ),
    balance: jobs.reduce(
      (s, j) =>
        s +
        (j.balanceRemaining ??
          (j.paymentStatus === "Unpaid" ? j.grandTotal : 0)),
      0,
    ),
  };

  return (
    <Box>
      <ServiceTypeCharts jobs={jobs} />

      {/* Sales table */}
      <Card
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  {[
                    "Date",
                    "Job Ref",
                    "Customer",
                    "Car",
                    "Service",
                    "Total",
                    "Paid",
                    "Balance",
                    "Method",
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
                {paginated.map((job) => {
                  const paid =
                    job.paymentStatus === "Paid"
                      ? job.grandTotal
                      : (job.depositAmount ?? 0);
                  const balance =
                    job.balanceRemaining ??
                    (job.paymentStatus === "Unpaid" ? job.grandTotal : 0);
                  return (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontSize: 12 }}>
                        {job.createdAt.slice(0, 10)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>
                        {job.jobRef}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {job.customerName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {job.carMake} {job.carModel}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.serviceType}
                          size="small"
                          sx={{
                            fontSize: 10,
                            height: 20,
                            bgcolor: SERVICE_TYPE_COLOR[job.serviceType] + "22",
                            color: SERVICE_TYPE_COLOR[job.serviceType],
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {formatKsh(job.grandTotal)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: "#16A34A" }}>
                        {formatKsh(paid)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12,
                          color: balance > 0 ? "#DC2626" : "text.secondary",
                        }}
                      >
                        {formatKsh(balance)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.paymentStatus}
                          size="small"
                          sx={{
                            fontSize: 10,
                            height: 20,
                            bgcolor:
                              PAYMENT_STATUS_COLOR[job.paymentStatus] + "22",
                            color: PAYMENT_STATUS_COLOR[job.paymentStatus],
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Totals row */}
                <TableRow sx={{ bgcolor: "action.selected" }}>
                  <TableCell colSpan={5} sx={{ fontWeight: 700, fontSize: 12 }}>
                    TOTAL ({jobs.length} jobs)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>
                    {formatKsh(totals.grandTotal)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: 12, color: "#16A34A" }}
                  >
                    {formatKsh(totals.paid)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: 12, color: "#DC2626" }}
                  >
                    {formatKsh(totals.balance)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={jobs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            onPageChange={(_, p) => setPage(p)}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
