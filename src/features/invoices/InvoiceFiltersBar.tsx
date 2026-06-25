import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";

export type InvoiceFilters = {
  search: string;
  dateFrom: string;
  dateTo: string;
};

type Props = {
  filters: InvoiceFilters;
  onChange: (f: InvoiceFilters) => void;
};

function countActiveFilters(f: InvoiceFilters): number {
  let count = 0;
  if (f.dateFrom) count++;
  if (f.dateTo) count++;
  return count;
}

export function InvoiceFiltersBar({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  function set(key: keyof InvoiceFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function handleClear() {
    onChange({ search: "", dateFrom: "", dateTo: "" });
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search bar + filter toggle */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Search invoice or client..."
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
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {activeCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleClear}
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
          {filters.dateFrom && (
            <Chip label={`From: ${filters.dateFrom}`} size="small" onDelete={() => set("dateFrom", "")} />
          )}
          {filters.dateTo && (
            <Chip label={`To: ${filters.dateTo}`} size="small" onDelete={() => set("dateTo", "")} />
          )}
        </Box>
      )}
    </Box>
  );
}
