import { ClearOutlined, FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  CAR_MAKES,
  JOB_STATUSES,
  PAYMENT_STATUSES,
  SERVICE_TYPES,
  TECHNICIANS,
} from "./sales.constants";
import type { SalesFilters } from "./sales.types";

export type { SalesFilters };

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

function countActiveFilters(f: SalesFilters): number {
  let count = 0;
  if (f.paymentStatus !== "All") count++;
  if (f.serviceType !== "All") count++;
  if (f.carMake !== "All Makes") count++;
  if (f.technician !== "All") count++;
  if (f.jobStatus !== "All") count++;
  if (f.dateFrom) count++;
  if (f.dateTo) count++;
  return count;
}

type Props = {
  filters: SalesFilters;
  onChange: (filters: SalesFilters) => void;
};

export function SalesFiltersBar({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  function set(key: keyof SalesFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange(DEFAULT_SALES_FILTERS);
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr auto", sm: "minmax(260px, 1fr) auto" },
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search customer, plate, or phone..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          size="small"
          fullWidth
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
        <Button
          variant={expanded ? "contained" : "outlined"}
          startIcon={<FilterListOutlined />}
          onClick={() => setExpanded(!expanded)}
          sx={{
            minHeight: 40,
            px: { xs: 1.25, sm: 2 },
            whiteSpace: "nowrap",
          }}
        >
          Filters
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              sx={{
                ml: 0.75,
                height: 18,
                minWidth: 18,
                bgcolor: expanded ? "white" : "error.main",
                color: expanded ? "primary.main" : "white",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            />
          )}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.25,
            mt: 1.5,
            p: 1.5,
            bgcolor: "rgba(31, 41, 51, 0.03)",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <TextField
            select
            label="Payment Status"
            value={filters.paymentStatus}
            onChange={(e) => set("paymentStatus", e.target.value)}
            size="small"
            fullWidth
          >
            {PAYMENT_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Service Type"
            value={filters.serviceType}
            onChange={(e) => set("serviceType", e.target.value)}
            size="small"
            fullWidth
          >
            {SERVICE_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Car Make"
            value={filters.carMake}
            onChange={(e) => set("carMake", e.target.value)}
            size="small"
            fullWidth
          >
            {CAR_MAKES.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Technician"
            value={filters.technician}
            onChange={(e) => set("technician", e.target.value)}
            size="small"
            fullWidth
          >
            {TECHNICIANS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Job Status"
            value={filters.jobStatus}
            onChange={(e) => set("jobStatus", e.target.value)}
            size="small"
            fullWidth
          >
            {JOB_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {activeCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearOutlined />}
              onClick={clearAll}
              sx={{ minHeight: 40 }}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Collapse>

      {!expanded && activeCount > 0 && (
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1 }}>
          {filters.paymentStatus !== "All" && (
            <Chip label={filters.paymentStatus} size="small" onDelete={() => set("paymentStatus", "All")} />
          )}
          {filters.serviceType !== "All" && (
            <Chip label={filters.serviceType} size="small" onDelete={() => set("serviceType", "All")} />
          )}
          {filters.carMake !== "All Makes" && (
            <Chip label={filters.carMake} size="small" onDelete={() => set("carMake", "All Makes")} />
          )}
          {filters.technician !== "All" && (
            <Chip label={filters.technician} size="small" onDelete={() => set("technician", "All")} />
          )}
          {filters.jobStatus !== "All" && (
            <Chip label={filters.jobStatus} size="small" onDelete={() => set("jobStatus", "All")} />
          )}
        </Box>
      )}
    </Box>
  );
}
