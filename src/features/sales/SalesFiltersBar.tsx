import { ClearOutlined, FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
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
      {/* Search bar + filter toggle */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Search name or plate..."
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
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            border: "1px solid",
            borderColor: expanded ? "primary.main" : "divider",
            bgcolor: expanded ? "primary.main" : "transparent",
            color: expanded ? "white" : "text.secondary",
            "&:hover": {
              bgcolor: expanded ? "primary.dark" : "action.hover",
            },
          }}
        >
          <FilterListOutlined />
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              sx={{
                position: "absolute",
                top: -6,
                right: -6,
                height: 18,
                minWidth: 18,
                bgcolor: "error.main",
                color: "white",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            />
          )}
        </IconButton>
      </Box>

      {/* Collapsible filter options */}
      <Collapse in={expanded}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 1.5,
            p: 1.5,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <TextField
            select
            label="Payment Status"
            value={filters.paymentStatus}
            onChange={(e) => set("paymentStatus", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
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
            sx={{ minWidth: 140 }}
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
            sx={{ minWidth: 130 }}
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
            sx={{ minWidth: 130 }}
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
            sx={{ minWidth: 140 }}
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
            sx={{ minWidth: 140 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {activeCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearOutlined />}
              onClick={clearAll}
              sx={{ alignSelf: "center" }}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Collapse>

      {/* Active filter chips (when collapsed) */}
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
