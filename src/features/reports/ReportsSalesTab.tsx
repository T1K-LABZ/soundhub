import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
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

  const pmMap: Record<string, number> = {};
  for (const j of jobs)
    pmMap[j.paymentMethod] = (pmMap[j.paymentMethod] ?? 0) + 1;
  const pmData = Object.entries(pmMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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

function SaleCard({ job }: { job: Job }) {
  const paid =
    job.paymentStatus === "Paid"
      ? job.grandTotal
      : (job.depositAmount ?? 0);
  const balance =
    job.balanceRemaining ??
    (job.paymentStatus === "Unpaid" ? job.grandTotal : 0);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {job.createdAt.slice(0, 10)}
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {job.jobRef}
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
          {job.customerName}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {job.carMake} {job.carModel}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
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
          <Chip
            label={job.paymentStatus}
            size="small"
            sx={{
              fontSize: 10,
              height: 20,
              bgcolor: PAYMENT_STATUS_COLOR[job.paymentStatus] + "22",
              color: PAYMENT_STATUS_COLOR[job.paymentStatus],
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography variant="caption" fontWeight={700}>{formatKsh(job.grandTotal)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Paid</Typography>
          <Typography variant="caption" fontWeight={700} color="#16A34A">{formatKsh(paid)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">Balance</Typography>
          <Typography variant="caption" fontWeight={700} color={balance > 0 ? "#DC2626" : "text.secondary"}>
            {formatKsh(balance)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function ReportsSalesTab({ jobs }: Props) {
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

      {/* Summary row */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Card variant="outlined" sx={{ flex: "1 1 30%", minWidth: 160, borderRadius: 2 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
            <Typography variant="h6" fontWeight={700}>{formatKsh(totals.grandTotal)}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: "1 1 30%", minWidth: 160, borderRadius: 2 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="caption" color="text.secondary">Collected</Typography>
            <Typography variant="h6" fontWeight={700} color="#16A34A">{formatKsh(totals.paid)}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: "1 1 30%", minWidth: 160, borderRadius: 2 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="caption" color="text.secondary">Outstanding</Typography>
            <Typography variant="h6" fontWeight={700} color="#DC2626">{formatKsh(totals.balance)}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Sales cards grid */}
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SaleCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
