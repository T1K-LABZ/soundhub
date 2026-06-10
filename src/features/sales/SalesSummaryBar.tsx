import {
  AttachMoneyOutlined,
  CheckCircleOutlined,
  HourglassEmptyOutlined,
  MoneyOffOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import type { SalesSummary } from "./sales.types";
import { formatKsh } from "./sales.utils";

// ── SummaryCard ───────────────────────────────────────────────────────────────

type SummaryCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
};

function SummaryCard({ label, value, sub, icon, color }: SummaryCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          height: "100%",
          boxSizing: "border-box",
          "&:last-child": { pb: 2 },
        }}
      >
        {/* Coloured icon badge */}
        <Box
          sx={{
            bgcolor: `${color}18`,
            color,
            borderRadius: 2,
            p: 1,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        {/* Text block */}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
          <Tooltip title={value} disableHoverListener={value.length < 20}>
            <Typography
              variant="h6"
              fontWeight={700}
              noWrap
              sx={{ lineHeight: 1.3 }}
            >
              {value}
            </Typography>
          </Tooltip>
          {sub && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// ── SalesSummaryBar ───────────────────────────────────────────────────────────

type Props = {
  summary: SalesSummary;
};

export function SalesSummaryBar({ summary }: Props) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
      {/* Total sales this month */}
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Total Sales This Month"
          value={formatKsh(summary.totalSalesMonth)}
          icon={<AttachMoneyOutlined />}
          color="#9333EA"
        />
      </Grid>

      {/* Paid jobs */}
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Paid Jobs"
          value={summary.paidCount.toString()}
          sub={formatKsh(summary.paidValue)}
          icon={<CheckCircleOutlined />}
          color="#16A34A"
        />
      </Grid>

      {/* Unpaid jobs */}
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Unpaid Jobs"
          value={summary.unpaidCount.toString()}
          sub={formatKsh(summary.unpaidValue)}
          icon={<MoneyOffOutlined />}
          color="#DC2626"
        />
      </Grid>

      {/* Deposits pending */}
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Deposits Pending"
          value={summary.depositCount.toString()}
          sub={`Balance: ${formatKsh(summary.depositBalance)}`}
          icon={<HourglassEmptyOutlined />}
          color="#D97706"
        />
      </Grid>

      {/* Completed today */}
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Completed Today"
          value={summary.completedToday.toString()}
          icon={<TodayOutlined />}
          color="#2563EB"
        />
      </Grid>
    </Grid>
  );
}
