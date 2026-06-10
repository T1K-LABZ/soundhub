import { SearchOutlined } from "@mui/icons-material";
import { Box, InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  BRANDS,
  CATEGORIES,
  MOVEMENT_TYPES,
  STAFF_MEMBERS,
} from "./inventory.constants";

export type InventoryFilters = {
  search: string;
  category: string;
  brand: string;
  movementType: string;
  staff: string;
  dateFrom: string;
  dateTo: string;
};

type Props = {
  filters: InventoryFilters;
  onChange: (filters: InventoryFilters) => void;
};

export function InventoryFiltersBar({ filters, onChange }: Props) {
  function set(key: keyof InventoryFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
      <TextField
        placeholder="Search name or serial no…"
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
        label="Category"
        value={filters.category}
        onChange={(e) => set("category", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
      >
        {CATEGORIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Brand"
        value={filters.brand}
        onChange={(e) => set("brand", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {BRANDS.map((b) => (
          <MenuItem key={b} value={b}>
            {b}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Movement"
        value={filters.movementType}
        onChange={(e) => set("movementType", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {MOVEMENT_TYPES.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Staff"
        value={filters.staff}
        onChange={(e) => set("staff", e.target.value)}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {STAFF_MEMBERS.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="From"
        type="date"
        value={filters.dateFrom}
        onChange={(e) => set("dateFrom", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        label="To"
        type="date"
        value={filters.dateTo}
        onChange={(e) => set("dateTo", e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Box>
  );
}
