import {
  EmojiEventsOutlined,
  GroupOutlined,
  PersonOffOutlined,
  PersonOutlined,
  WorkOutlined,
} from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";

type Props = {
  total: number;
  active: number;
  onLeave: number;
  topPerformerName: string;
  topPerformerJobs: number;
  totalJobsThisMonth: number;
};

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
          <Typography variant="body2" color="text.secondary" display="block" noWrap>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} noWrap sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function StaffSummaryBar({
  total,
  active,
  onLeave,
  topPerformerName,
  topPerformerJobs,
  totalJobsThisMonth,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
      }}
    >
      <Box sx={{ display: "flex", gap: 2, minWidth: "min-content" }}>
        <SummaryCard
          label="Total Staff"
          value={total.toString()}
          icon={<GroupOutlined fontSize="small" />}
          color="#2563EB"
        />
        <SummaryCard
          label="Active Staff"
          value={active.toString()}
          icon={<PersonOutlined fontSize="small" />}
          color="#16A34A"
        />
        <SummaryCard
          label="On Leave"
          value={onLeave.toString()}
          icon={<PersonOffOutlined fontSize="small" />}
          color="#D97706"
        />
        <SummaryCard
          label="Top Performer"
          value={topPerformerName}
          sub={`${topPerformerJobs} jobs`}
          icon={<EmojiEventsOutlined fontSize="small" />}
          color="#9333EA"
        />
        <SummaryCard
          label="Jobs This Month"
          value={totalJobsThisMonth.toString()}
          sub="All staff combined"
          icon={<WorkOutlined fontSize="small" />}
          color="#0891B2"
        />
      </Box>
    </Box>
  );
}
