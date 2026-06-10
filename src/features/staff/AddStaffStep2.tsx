import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  EMPLOYMENT_TYPES,
  SPECIALIZATIONS,
  STAFF_ROLES,
  STAFF_STATUSES,
} from "./staff.constants";
import type { AddStaffForm, Specialization } from "./staff.types";

type Props = {
  form: AddStaffForm;
  onChange: <K extends keyof AddStaffForm>(k: K, v: AddStaffForm[K]) => void;
};

export function AddStaffStep2({ form, onChange }: Props) {
  function toggleSpec(spec: Specialization) {
    const current = form.specializations;
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    onChange("specializations", updated);
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Role"
          value={form.role}
          onChange={(e) =>
            onChange("role", e.target.value as AddStaffForm["role"])
          }
          fullWidth
          required
        >
          {STAFF_ROLES.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Employment Type"
          value={form.employmentType}
          onChange={(e) =>
            onChange(
              "employmentType",
              e.target.value as AddStaffForm["employmentType"],
            )
          }
          fullWidth
          required
        >
          {EMPLOYMENT_TYPES.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={0.5}
        >
          Specializations (select all that apply)
        </Typography>
        {SPECIALIZATIONS.map((spec) => (
          <FormControlLabel
            key={spec}
            control={
              <Checkbox
                size="small"
                checked={form.specializations.includes(spec)}
                onChange={() => toggleSpec(spec)}
              />
            }
            label={spec}
          />
        ))}
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Date Joined"
          type="date"
          value={form.dateJoined}
          onChange={(e) => onChange("dateJoined", e.target.value)}
          fullWidth
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Salary / Pay Rate (KES)"
          type="number"
          value={form.salaryRate || ""}
          onChange={(e) => onChange("salaryRate", Number(e.target.value))}
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Status"
          value={form.status}
          onChange={(e) =>
            onChange("status", e.target.value as AddStaffForm["status"])
          }
          fullWidth
        >
          {STAFF_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Notes"
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Any relevant notes about this staff member…"
        />
      </Grid>
    </Grid>
  );
}
