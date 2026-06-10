import { Box, Grid, Typography } from "@mui/material";
import { StaffCard } from "./StaffCard";
import type { StaffMember, StaffPerformance } from "./staff.types";

type Props = {
  staff: StaffMember[];
  performances: StaffPerformance[];
  onView: (s: StaffMember) => void;
  onEdit: (s: StaffMember) => void;
  onMarkLeave: (s: StaffMember) => void;
  onDeactivate: (s: StaffMember) => void;
};

export function StaffGrid({
  staff,
  performances,
  onView,
  onEdit,
  onMarkLeave,
  onDeactivate,
}: Props) {
  if (staff.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No staff members match your filters
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {staff.map((s) => (
        <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <StaffCard
            staff={s}
            performance={performances.find((p) => p.staffId === s.id)}
            onView={() => onView(s)}
            onEdit={() => onEdit(s)}
            onMarkLeave={() => onMarkLeave(s)}
            onDeactivate={() => onDeactivate(s)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
