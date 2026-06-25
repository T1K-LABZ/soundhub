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
  FILTER_CAR_MAKES,
  FILTER_LOCATIONS,
  FILTER_TIERS,
  LAST_VISIT_OPTIONS,
  SORT_OPTIONS,
} from "./customers.constants";
import type { CustomerFilters } from "./customers.types";

type Props = {
  filters: CustomerFilters;
  view: "grid" | "table";
  onChange: (f: CustomerFilters) => void;
  onViewChange: (v: "grid" | "table") => void;
  onClear: () => void;
};

function countActiveFilters(f: CustomerFilters): number {
  let count = 0;
  if (f.tier !== "All") count++;
  if (f.location !== "All") count++;
  if (f.lastVisit !== "Any Time") count++;
  if (f.carMake !== "All") count++;
  if (f.sortBy !== "Most Recent") count++;
  return count;
}

export function CustomerFiltersBar({
  filters,
  view,
  onChange,
  onViewChange,
  onClear,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  function set(key: keyof CustomerFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search bar + filter toggle + view toggle */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Search name, phone or plate..."
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
          <ToggleButton value="grid">
            <GridViewOutlined fontSize="small" />
          </ToggleButton>
          <ToggleButton value="table">
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
            label="Tier"
            value={filters.tier}
            onChange={(e) => set("tier", e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {FILTER_TIERS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Location"
            value={filters.location}
            onChange={(e) => set("location", e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            {FILTER_LOCATIONS.map((l) => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Last Visit"
            value={filters.lastVisit}
            onChange={(e) => set("lastVisit", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {LAST_VISIT_OPTIONS.map((o) => (
              <MenuItem key={o} value={o}>{o}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Car Make"
            value={filters.carMake}
            onChange={(e) => set("carMake", e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {FILTER_CAR_MAKES.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => set("sortBy", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {SORT_OPTIONS.map((s) => (
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
          {filters.tier !== "All" && (
            <Chip label={filters.tier} size="small" onDelete={() => set("tier", "All")} />
          )}
          {filters.location !== "All" && (
            <Chip label={filters.location} size="small" onDelete={() => set("location", "All")} />
          )}
          {filters.lastVisit !== "Any Time" && (
            <Chip label={filters.lastVisit} size="small" onDelete={() => set("lastVisit", "Any Time")} />
          )}
          {filters.carMake !== "All" && (
            <Chip label={filters.carMake} size="small" onDelete={() => set("carMake", "All")} />
          )}
        </Box>
      )}
    </Box>
  );
}
