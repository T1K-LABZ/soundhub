import {
  EmojiEventsOutlined,
  GroupOutlined,
  PersonOffOutlined,
  PersonOutlined,
  WorkOutlined,
} from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

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

export function StaffSummaryBar({
  total,
  active,
  onLeave,
  topPerformerName,
  topPerformerJobs,
  totalJobsThisMonth,
}: Props) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
      <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Total Staff"
          value={total.toString()}
          icon={<GroupOutlined />}
          color="#2563EB"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Active Staff"
          value={active.toString()}
          icon={<PersonOutlined />}
          color="#16A34A"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="On Leave"
          value={onLeave.toString()}
          icon={<PersonOffOutlined />}
          color="#D97706"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Top Performer This Month"
          value={topPerformerName}
          sub={`${topPerformerJobs} jobs`}
          icon={<EmojiEventsOutlined />}
          color="#9333EA"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Total Jobs This Month"
          value={totalJobsThisMonth.toString()}
          sub="All staff combined"
          icon={<WorkOutlined />}
          color="#0891B2"
        />
      </Grid>
    </Grid>
  );
}
