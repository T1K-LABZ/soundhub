import {
  DiamondOutlined,
  GroupOutlined,
  PersonAddOutlined,
  StarOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import type { CustomerSummary } from "./customers.types";
import { formatKsh } from "./customers.utils";

type CardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
};

function SummaryCard({ label, value, sub, icon, color }: CardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
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
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} noWrap>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function CustomerSummaryBar({ summary }: { summary: CustomerSummary }) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Row 1 — tier counts */}
      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Total Customers"
            value={summary.total.toString()}
            icon={<GroupOutlined />}
            color="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="New This Month"
            value={summary.newThisMonth.toString()}
            icon={<PersonAddOutlined />}
            color="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Regular"
            value={summary.regular.toString()}
            sub="2-5 visits"
            icon={<GroupOutlined />}
            color="#3b82f6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Loyal"
            value={summary.loyal.toString()}
            sub="6-9 visits"
            icon={<StarOutlined />}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="VIP"
            value={summary.vip.toString()}
            sub="10+ visits or 50k+"
            icon={<DiamondOutlined />}
            color="#a855f7"
          />
        </Grid>
      </Grid>

      {/* Row 2 — revenue & engagement */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Lifetime Revenue"
            value={formatKsh(summary.totalLifetimeRevenue)}
            icon={<TrendingUpOutlined />}
            color="#9333EA"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Avg Spend / Customer"
            value={formatKsh(summary.avgSpendPerCustomer)}
            icon={<TrendingUpOutlined />}
            color="#0891B2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Avg Visits / Customer"
            value={summary.avgVisitsPerCustomer.toString()}
            icon={<GroupOutlined />}
            color="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Retention Rate"
            value={`${summary.retentionRate}%`}
            sub="Returned customers"
            icon={<StarOutlined />}
            color="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
          <SummaryCard
            label="Pending Offers"
            value={summary.pendingOffers.toString()}
            sub="Awaiting response"
            icon={<PersonAddOutlined />}
            color="#D97706"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
