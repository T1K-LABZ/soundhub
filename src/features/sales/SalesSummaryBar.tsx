import {
  AttachMoneyOutlined,
  CheckCircleOutlined,
  HourglassEmptyOutlined,
  MoneyOffOutlined,
  PendingActionsOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import type { SalesStats } from "./sales.api";
import { formatKsh } from "./sales.utils";

type SummaryCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
};

function SummaryCard({ label, value, sub, icon, color }: SummaryCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        minWidth: 140,
        flex: "1 1 140px",
        display: "flex",
        overflow: "hidden",
        borderColor: "rgba(31, 41, 51, 0.08)",
        boxShadow: "0 10px 28px rgba(31, 41, 51, 0.06)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          p: 1.5,
          height: "100%",
          boxSizing: "border-box",
          "&:last-child": { pb: 1.5 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: `${color}18`,
            color,
            borderRadius: 1.5,
            p: 0.75,
            display: "flex",
            flexShrink: 0,
            boxShadow: `inset 0 0 0 1px ${color}24`,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ lineHeight: 1.2, mb: 0.25, fontWeight: 700 }}
          >
            {label}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ lineHeight: 1.2, wordBreak: "break-word" }}
          >
            {value}
          </Typography>
          {sub && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ lineHeight: 1.2, mt: 0.25 }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

type Props = {
  stats: SalesStats;
};

export function SalesSummaryBar({ stats }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(160px, 1fr))",
          sm: "repeat(3, minmax(160px, 1fr))",
          lg: "repeat(6, minmax(0, 1fr))",
        },
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 2, md: 3 },
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "grey.400",
          borderRadius: 2,
        },
      }}
    >
      <SummaryCard
        label="Sales This Month"
        value={formatKsh(stats.totalSalesThisMonth)}
        icon={<AttachMoneyOutlined fontSize="small" />}
        color="#9333EA"
      />
      <SummaryCard
        label="Paid Jobs"
        value={stats.paidJobs.toString()}
        sub={`${stats.totalSales} total`}
        icon={<CheckCircleOutlined fontSize="small" />}
        color="#16A34A"
      />
      <SummaryCard
        label="Unpaid Jobs"
        value={stats.unpaidJobs.toString()}
        sub={formatKsh(stats.totalDeposits)}
        icon={<MoneyOffOutlined fontSize="small" />}
        color="#DC2626"
      />
      <SummaryCard
        label="Pending"
        value={stats.pendingJobs.toString()}
        icon={<PendingActionsOutlined fontSize="small" />}
        color="#D97706"
      />
      <SummaryCard
        label="In Progress"
        value={stats.inProgressJobs.toString()}
        icon={<HourglassEmptyOutlined fontSize="small" />}
        color="#2563EB"
      />
      <SummaryCard
        label="Completed"
        value={stats.completedJobs.toString()}
        icon={<TodayOutlined fontSize="small" />}
        color="#16A34A"
      />
    </Box>
  );
}
