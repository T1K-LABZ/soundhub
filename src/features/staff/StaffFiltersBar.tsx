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

export function StaffFiltersBar({
  filters,
  view,
  onChange,
  onViewChange,
  onClear,
}: Props) {
  function set(key: keyof StaffFilters, value: string) {
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
        placeholder="Search name or phone…"
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

      <TextField
        select
        label="Role"
        value={filters.role}
        onChange={(e) => set("role", e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {FILTER_ROLES.map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Status"
        value={filters.status}
        onChange={(e) => set("status", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {FILTER_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Employment"
        value={filters.employmentType}
        onChange={(e) => set("employmentType", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {FILTER_EMPLOYMENT_TYPES.map((e) => (
          <MenuItem key={e} value={e}>
            {e}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Specialization"
        value={filters.specialization}
        onChange={(e) => set("specialization", e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {FILTER_SPECIALIZATIONS.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <Button size="small" color="error" variant="outlined" onClick={onClear}>
        Clear
      </Button>

      {/* View toggle pushed to the right */}
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
