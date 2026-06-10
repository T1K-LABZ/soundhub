import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { TIME_RANGE_OPTIONS } from "./inventory.constants";
import { CATEGORIES } from "./inventory.constants";
import type { TimeRange } from "./inventory.types";

type Props = {
  range: TimeRange;
  category: string;
  onRangeChange: (r: TimeRange) => void;
  onCategoryChange: (c: string) => void;
};

export function InventoryChartControls({
  range,
  category,
  onRangeChange,
  onCategoryChange,
}: Props) {
  // Category options for the chart filter — "All" + the real categories (no "All Categories" wording)
  const categoryOptions = [
    "All",
    ...CATEGORIES.filter((c) => c !== "All Categories"),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      {/* Time range toggle */}
      <ButtonGroup size="small" variant="outlined">
        {TIME_RANGE_OPTIONS.map((opt) => (
          <Button
            key={opt}
            variant={range === opt ? "contained" : "outlined"}
            onClick={() => onRangeChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </ButtonGroup>

      {/* Category dropdown */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categoryOptions.map((c) => (
            <MenuItem key={c} value={c === "All" ? "" : c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
