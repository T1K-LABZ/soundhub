import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  CAR_MAKES,
  JOB_STATUSES,
  PAYMENT_STATUSES,
  SERVICE_TYPES,
  TECHNICIANS,
} from "./sales.constants";
import type { SalesFilters } from "./sales.types";

export type { SalesFilters };

// ── Default filter state (exported so SalesPage can reset cleanly) ────────────

export const DEFAULT_SALES_FILTERS: SalesFilters = {
  search: "",
  paymentStatus: "All",
  serviceType: "All",
  dateFrom: "",
  dateTo: "",
  carMake: "All Makes",
  technician: "All",
  jobStatus: "All",
};

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  filters: SalesFilters;
  onChange: (filters: SalesFilters) => void;
};

export function SalesFiltersBar({ filters, onChange }: Props) {
  function set(key: keyof SalesFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange(DEFAULT_SALES_FILTERS);
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
      {/* Free-text search */}
      <TextField
        placeholder="Search name or plate…"
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Payment Status */}
      <TextField
        select
        label="Payment Status"
        value={filters.paymentStatus}
        onChange={(e) => set("paymentStatus", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
      >
        {PAYMENT_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      {/* Service Type */}
      <TextField
        select
        label="Service Type"
        value={filters.serviceType}
        onChange={(e) => set("serviceType", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
      >
        {SERVICE_TYPES.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {/* Date From */}
      <TextField
        label="From"
        type="date"
        value={filters.dateFrom}
        onChange={(e) => set("dateFrom", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Date To */}
      <TextField
        label="To"
        type="date"
        value={filters.dateTo}
        onChange={(e) => set("dateTo", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Car Make */}
      <TextField
        select
        label="Car Make"
        value={filters.carMake}
        onChange={(e) => set("carMake", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {CAR_MAKES.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </TextField>

      {/* Technician */}
      <TextField
        select
        label="Technician"
        value={filters.technician}
        onChange={(e) => set("technician", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {TECHNICIANS.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {/* Job Status */}
      <TextField
        select
        label="Job Status"
        value={filters.jobStatus}
        onChange={(e) => set("jobStatus", e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {JOB_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      {/* Clear all filters */}
      <Button
        variant="outlined"
        size="small"
        startIcon={<ClearOutlined />}
        onClick={clearAll}
        sx={{ height: 40, alignSelf: "center" }}
      >
        Clear
      </Button>
    </Box>
  );
}
