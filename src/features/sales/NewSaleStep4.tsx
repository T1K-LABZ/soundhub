import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../auth/auth.store";
import { useStaffListQuery } from "../staff/staff.api";
import type { DifficultyRating, JobStatus } from "./sales.types";
import { DIFFICULTY_COLOR, JOB_STATUS_COLOR } from "./sales.constants";

export type Step4Data = {
  technicianName: string;
  jobStatus: JobStatus;
  installationNotes: string;
  issuesEncountered: string;
  issuesResolution: string;
  difficultyRating: DifficultyRating;
  followUpNeeded: boolean;
  followUpNotes: string;
};

const JOB_STATUS_OPTIONS: JobStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Follow Up Needed",
];

const DIFFICULTY_OPTIONS: DifficultyRating[] = ["Easy", "Medium", "Complex"];

type Props = {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
};

export function NewSaleStep4({ data, onChange }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: staffList = [] } = useStaffListQuery(storeId);

  function set<K extends keyof Step4Data>(key: K, value: Step4Data[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {/* Technician */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Technician"
            fullWidth
            size="small"
            value={data.technicianName}
            onChange={(e) => set("technicianName", e.target.value)}
            required
          >
            {staffList.map((s) => (
              <MenuItem key={s.id} value={s.user.fullName}>
                {s.user.fullName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Job status */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Job Status"
            fullWidth
            size="small"
            value={data.jobStatus}
            onChange={(e) => set("jobStatus", e.target.value as JobStatus)}
            required
          >
            {JOB_STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Installation notes */}
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Installation Notes"
            multiline
            rows={4}
            fullWidth
            size="small"
            value={data.installationNotes}
            onChange={(e) => set("installationNotes", e.target.value)}
            placeholder="Describe the installation in detail…"
            required
          />
        </Grid>

        {/* Issues */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Issues Encountered (optional)"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={data.issuesEncountered}
            onChange={(e) => set("issuesEncountered", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Resolution (optional)"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={data.issuesResolution}
            onChange={(e) => set("issuesResolution", e.target.value)}
          />
        </Grid>

        {/* Difficulty rating */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Difficulty Rating
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {DIFFICULTY_OPTIONS.map((d) => {
              const color = DIFFICULTY_COLOR[d];
              const selected = data.difficultyRating === d;
              return (
                <Button
                  key={d}
                  size="small"
                  variant={selected ? "contained" : "outlined"}
                  onClick={() => set("difficultyRating", d)}
                  sx={{
                    borderColor: color,
                    color: selected ? "white" : color,
                    bgcolor: selected ? color : "transparent",
                    "&:hover": { bgcolor: selected ? color : `${color}18` },
                  }}
                >
                  {d}
                </Button>
              );
            })}
          </Box>
        </Grid>

        {/* Follow-up toggle */}
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={data.followUpNeeded}
                onChange={(e) => set("followUpNeeded", e.target.checked)}
              />
            }
            label="Follow-up needed"
          />
        </Grid>

        {data.followUpNeeded && (
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Follow-up Notes"
              multiline
              rows={2}
              fullWidth
              size="small"
              value={data.followUpNotes}
              onChange={(e) => set("followUpNotes", e.target.value)}
              placeholder="What needs to happen on the follow-up visit?"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

// Suppress unused import warning — JOB_STATUS_COLOR imported for future use
void JOB_STATUS_COLOR;
