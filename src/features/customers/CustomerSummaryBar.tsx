import {
  DiamondOutlined,
  GroupOutlined,
  PersonAddOutlined,
  StarOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
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
    <Card
      variant="outlined"
      sx={{ height: "100%", minWidth: 140, flex: "1 1 0", display: "flex" }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          height: "100%",
          boxSizing: "border-box",
          "&:last-child": { pb: 2 },
          width: "100%",
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
          <Typography variant="body2" color="text.secondary" display="block">
            {label}
          </Typography>
          <Typography variant="h7" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary" display="block">
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, minWidth: "min-content" }}>
          <SummaryCard
            label="Total Customers"
            value={summary.total.toString()}
            icon={<GroupOutlined fontSize="small" />}
            color="#2563EB"
          />
          <SummaryCard
            label="New This Month"
            value={summary.newThisMonth.toString()}
            icon={<PersonAddOutlined fontSize="small" />}
            color="#16A34A"
          />
          <SummaryCard
            label="Regular"
            value={summary.regular.toString()}
            sub="2-5 visits"
            icon={<GroupOutlined fontSize="small" />}
            color="#3b82f6"
          />
          <SummaryCard
            label="Loyal"
            value={summary.loyal.toString()}
            sub="6-9 visits"
            icon={<StarOutlined fontSize="small" />}
            color="#f59e0b"
          />
          <SummaryCard
            label="VIP"
            value={summary.vip.toString()}
            sub="10+ visits"
            icon={<DiamondOutlined fontSize="small" />}
            color="#a855f7"
          />
        </Box>
      </Box>

      {/* Row 2 — revenue & engagement */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, minWidth: "min-content" }}>
          <SummaryCard
            label="Lifetime Revenue"
            value={formatKsh(summary.totalLifetimeRevenue)}
            icon={<TrendingUpOutlined fontSize="small" />}
            color="#9333EA"
          />
          <SummaryCard
            label="Avg Spend"
            value={formatKsh(summary.avgSpendPerCustomer)}
            icon={<TrendingUpOutlined fontSize="small" />}
            color="#0891B2"
          />
          <SummaryCard
            label="Avg Visits"
            value={summary.avgVisitsPerCustomer.toString()}
            icon={<GroupOutlined fontSize="small" />}
            color="#2563EB"
          />
          <SummaryCard
            label="Retention"
            value={`${summary.retentionRate}%`}
            icon={<StarOutlined fontSize="small" />}
            color="#16A34A"
          />
          <SummaryCard
            label="Pending Offers"
            value={summary.pendingOffers.toString()}
            icon={<PersonAddOutlined fontSize="small" />}
            color="#D97706"
          />
        </Box>
      </Box>
    </Box>
  );
}
