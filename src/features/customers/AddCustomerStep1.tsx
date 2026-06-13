import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { NAIROBI_AREAS } from "./customers.constants";
import type { AddCustomerForm } from "./customers.types";

type Props = {
  form: AddCustomerForm;
  onChange: <K extends keyof AddCustomerForm>(
    k: K,
    v: AddCustomerForm[K],
  ) => void;
};

export function AddCustomerStep1({ form, onChange }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
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
          helperText="Primary customer ID"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          fullWidth
          placeholder="Optional"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Location / Area"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          fullWidth
        >
          {NAIROBI_AREAS.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Birthday"
          type="date"
          value={form.birthday}
          onChange={(e) => onChange("birthday", e.target.value)}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          helperText="Optional — used for birthday campaigns"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Preferred Contact"
          value={form.contactPreference}
          onChange={(e) =>
            onChange(
              "contactPreference",
              e.target.value as AddCustomerForm["contactPreference"],
            )
          }
          fullWidth
        >
          {(["Whatsapp", "Call", "SMS"] as const).map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.optedInToPromos}
              onChange={(e) => onChange("optedInToPromos", e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              Opted in to promotions &amp; offers
            </Typography>
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Notes"
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Any relevant notes about this customer…"
        />
      </Grid>
    </Grid>
  );
}
