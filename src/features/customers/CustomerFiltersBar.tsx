import {
  GridViewOutlined,
  SearchOutlined,
  TableRowsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
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

export function CustomerFiltersBar({
  filters,
  view,
  onChange,
  onViewChange,
  onClear,
}: Props) {
  function set(key: keyof CustomerFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        alignItems: "center",
      }}
    >
      <TextField
        placeholder="Search name, phone or plate…"
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        size="small"
        sx={{ minWidth: 220 }}
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

      <TextField
        select
        label="Tier"
        value={filters.tier}
        onChange={(e) => set("tier", e.target.value)}
        size="small"
        sx={{ minWidth: 120 }}
      >
        {FILTER_TIERS.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Location"
        value={filters.location}
        onChange={(e) => set("location", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {FILTER_LOCATIONS.map((l) => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Last Visit"
        value={filters.lastVisit}
        onChange={(e) => set("lastVisit", e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {LAST_VISIT_OPTIONS.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
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
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
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
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <Button size="small" color="error" variant="outlined" onClick={onClear}>
        Clear
      </Button>

      <Box sx={{ ml: "auto" }}>
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
    </Box>
  );
}
