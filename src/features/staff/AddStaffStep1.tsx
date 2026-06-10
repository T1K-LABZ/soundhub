import { Grid, TextField } from "@mui/material";
import type { AddStaffForm } from "./staff.types";

type Props = {
  form: AddStaffForm;
  onChange: <K extends keyof AddStaffForm>(k: K, v: AddStaffForm[K]) => void;
};

export function AddStaffStep1({ form, onChange }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Full Name"
          value={form.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          fullWidth
          required
          autoFocus
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Phone Number"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          fullWidth
          required
          placeholder="07XX XXX XXX"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="National ID"
          value={form.nationalId}
          onChange={(e) => onChange("nationalId", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => onChange("dateOfBirth", e.target.value)}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Emergency Contact Name"
          value={form.emergencyContactName}
          onChange={(e) => onChange("emergencyContactName", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Emergency Contact Phone"
          value={form.emergencyContactPhone}
          onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
          fullWidth
          placeholder="07XX XXX XXX"
        />
      </Grid>
    </Grid>
  );
}
