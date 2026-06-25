import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

function countActiveFilters(f: InventoryFilters): number {
  let count = 0;
  if (f.category !== "All Categories") count++;
  if (f.brand !== "All Brands") count++;
  if (f.movementType !== "All Types") count++;
  if (f.staff !== "All Staff") count++;
  if (f.dateFrom) count++;
  if (f.dateTo) count++;
  return count;
}

export function InventoryFiltersBar({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  function set(key: keyof InventoryFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function handleClear() {
    onChange({
      search: "",
      category: "All Categories",
      brand: "All Brands",
      movementType: "All Types",
      staff: "All Staff",
      dateFrom: "",
      dateTo: "",
    });
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search bar + filter toggle */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Search name or serial..."
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
            label="Category"
            value={filters.category}
            onChange={(e) => set("category", e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Brand"
            value={filters.brand}
            onChange={(e) => set("brand", e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            {BRANDS.map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Movement"
            value={filters.movementType}
            onChange={(e) => set("movementType", e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            {MOVEMENT_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Staff"
            value={filters.staff}
            onChange={(e) => set("staff", e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            {STAFF_MEMBERS.map((s) => (
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
            <Button size="small" onClick={handleClear} sx={{ alignSelf: "center" }}>
              Clear All
            </Button>
          )}
        </Box>
      </Collapse>

      {/* Active filter chips (when collapsed) */}
      {!expanded && activeCount > 0 && (
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1 }}>
          {filters.category !== "All Categories" && (
            <Chip
              label={filters.category}
              size="small"
              onDelete={() => set("category", "All Categories")}
            />
          )}
          {filters.brand !== "All Brands" && (
            <Chip
              label={filters.brand}
              size="small"
              onDelete={() => set("brand", "All Brands")}
            />
          )}
          {filters.movementType !== "All Types" && (
            <Chip
              label={filters.movementType}
              size="small"
              onDelete={() => set("movementType", "All Types")}
            />
          )}
          {filters.staff !== "All Staff" && (
            <Chip
              label={filters.staff}
              size="small"
              onDelete={() => set("staff", "All Staff")}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
