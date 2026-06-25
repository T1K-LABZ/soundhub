import {
  FilterListOutlined,
  GridViewOutlined,
  SearchOutlined,
  TableRowsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import {
  FILTER_EMPLOYMENT_TYPES,
  FILTER_ROLES,
  FILTER_SPECIALIZATIONS,
  FILTER_STATUSES,
} from "./staff.constants";
import type { StaffFilters } from "./staff.types";

type Props = {
  filters: StaffFilters;
  view: "grid" | "table";
  onChange: (f: StaffFilters) => void;
  onViewChange: (v: "grid" | "table") => void;
  onClear: () => void;
};

function countActiveFilters(f: StaffFilters): number {
  let count = 0;
  if (f.role !== "All") count++;
  if (f.status !== "All") count++;
  if (f.employmentType !== "All") count++;
  if (f.specialization !== "All") count++;
  return count;
}

export function StaffFiltersBar({
  filters,
  view,
  onChange,
  onViewChange,
  onClear,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  function set(key: keyof StaffFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search bar + filter toggle + view toggle */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Search name or phone…"
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
            "&:hover": { bgcolor: expanded ? "primary.dark" : "action.hover" },
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
        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          onChange={(_, v) => v && onViewChange(v)}
        >
          <ToggleButton value="grid" aria-label="Grid view">
            <GridViewOutlined fontSize="small" />
          </ToggleButton>
          <ToggleButton value="table" aria-label="Table view">
            <TableRowsOutlined fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
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
            label="Role"
            value={filters.role}
            onChange={(e) => set("role", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {FILTER_ROLES.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {FILTER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Employment"
            value={filters.employmentType}
            onChange={(e) => set("employmentType", e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            {FILTER_EMPLOYMENT_TYPES.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Specialization"
            value={filters.specialization}
            onChange={(e) => set("specialization", e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {FILTER_SPECIALIZATIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          {activeCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={onClear}
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
          {filters.role !== "All" && (
            <Chip label={`Role: ${filters.role}`} size="small" onDelete={() => set("role", "All")} />
          )}
          {filters.status !== "All" && (
            <Chip label={`Status: ${filters.status}`} size="small" onDelete={() => set("status", "All")} />
          )}
          {filters.employmentType !== "All" && (
            <Chip label={`Employment: ${filters.employmentType}`} size="small" onDelete={() => set("employmentType", "All")} />
          )}
          {filters.specialization !== "All" && (
            <Chip label={`Specialization: ${filters.specialization}`} size="small" onDelete={() => set("specialization", "All")} />
          )}
        </Box>
      )}
    </Box>
  );
}
