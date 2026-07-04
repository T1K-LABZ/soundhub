import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { AddStaffForm } from "./staff.types";

type Props = {
  form: AddStaffForm;
  onChange: <K extends keyof AddStaffForm>(k: K, v: AddStaffForm[K]) => void;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function parseDate(iso: string) {
  if (!iso) return { day: "", month: "", year: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: "", month: "", year: "" };
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  };
}

function toISO(day: string, month: string, year: string) {
  if (!day || !month || !year) return "";
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
}

export function AddStaffStep1({ form, onChange }: Props) {
  const parsed = parseDate(form.dateOfBirth);
  const [day, setDay] = useState(parsed.day);
  const [month, setMonth] = useState(parsed.month);
  const [year, setYear] = useState(parsed.year);

  useEffect(() => {
    const p = parseDate(form.dateOfBirth);
    setDay(p.day);
    setMonth(p.month);
    setYear(p.year);
  }, [form.dateOfBirth]);

  function handleDateChange(
    field: "day" | "month" | "year",
    value: string,
  ) {
    const next = { day, month, year, [field]: value };
    if (field === "day") setDay(value);
    if (field === "month") setMonth(value);
    if (field === "year") setYear(value);

    const iso = toISO(next.day, next.month, next.year);
    if (iso) {
      onChange("dateOfBirth", iso);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="First Name"
          value={form.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          fullWidth
          required
          autoFocus
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Last Name"
          value={form.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          fullWidth
          required
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
          label="National ID"
          value={form.nationalId}
          onChange={(e) => onChange("nationalId", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="Day"
            value={day}
            onChange={(e) => handleDateChange("day", e.target.value)}
            fullWidth
            size="small"
          >
            {DAYS.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => handleDateChange("month", e.target.value)}
            fullWidth
            size="small"
          >
            {MONTHS.map((m, i) => (
              <MenuItem key={m} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Year"
            value={year}
            onChange={(e) => handleDateChange("year", e.target.value)}
            fullWidth
            size="small"
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Box>
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
