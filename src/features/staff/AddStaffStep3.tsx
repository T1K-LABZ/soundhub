import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { AddStaffForm } from "./staff.types";

type Props = {
  form: AddStaffForm;
  onChange: <K extends keyof AddStaffForm>(k: K, v: AddStaffForm[K]) => void;
};

export function AddStaffStep3({ form, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set a temporary password for this staff member. They will be required
          to change it on first login.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          fullWidth
          required
          helperText="Minimum 8 characters"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>

      {form.role && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Assigned Role
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {form.role} — permissions are managed by the role and can be edited
            later in Role Management.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
