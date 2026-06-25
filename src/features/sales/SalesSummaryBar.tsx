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
  Tooltip,
  Typography,
} from "@mui/material";
import type { SalesSummary } from "./sales.types";
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
      sx={{ height: "100%", minWidth: 0, flex: "1 1 0", display: "flex" }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
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
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            {label}
          </Typography>
          <Tooltip title={value} disableHoverListener={value.length < 18}>
            <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ lineHeight: 1.3 }}>
              {value}
            </Typography>
          </Tooltip>
          {sub && (
            <Tooltip title={sub} disableHoverListener={sub.length < 25}>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {sub}
              </Typography>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

type Props = {
  summary: SalesSummary;
};

export function SalesSummaryBar({ summary }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 3,
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "grey.400",
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, minWidth: "min-content" }}>
        <SummaryCard
          label="Sales This Month"
          value={formatKsh(summary.totalSalesMonth)}
          icon={<AttachMoneyOutlined fontSize="small" />}
          color="#9333EA"
        />
        <SummaryCard
          label="Paid Jobs"
          value={summary.paidCount.toString()}
          sub={formatKsh(summary.paidValue)}
          icon={<CheckCircleOutlined fontSize="small" />}
          color="#16A34A"
        />
        <SummaryCard
          label="Unpaid Jobs"
          value={summary.unpaidCount.toString()}
          sub={formatKsh(summary.unpaidValue)}
          icon={<MoneyOffOutlined fontSize="small" />}
          color="#DC2626"
        />
        <SummaryCard
          label="Deposits Pending"
          value={summary.depositCount.toString()}
          sub={`Bal: ${formatKsh(summary.depositBalance)}`}
          icon={<HourglassEmptyOutlined fontSize="small" />}
          color="#D97706"
        />
        <SummaryCard
          label="Completed Today"
          value={summary.completedToday.toString()}
          icon={<TodayOutlined fontSize="small" />}
          color="#2563EB"
        />
      </Box>
    </Box>
  );
}
