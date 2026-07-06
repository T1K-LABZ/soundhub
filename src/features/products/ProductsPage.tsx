import { FilterListOutlined, QrCodeScannerOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { ProductCard } from "./ProductCard";
import { AVAILABILITY_OPTIONS, PRICE_RANGES } from "./products.constants";
import type { AvailabilityFilter, Category, Product } from "./products.types";
import { getCategories, getItems, mapItemToProduct } from "./products.api";
import { filterProducts } from "./products.utils";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";

export function ProductsPage() {
  const storeId = useAuthStore((s) => s.user?.storeId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter state
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [priceRangeIdx, setPriceRangeIdx] = useState(0);

  const selectedRange = PRICE_RANGES[priceRangeIdx];

  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data } = await getItems(storeId, search ? { search } : undefined);
      setProducts(data.map(mapItemToProduct));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [storeId, search]);

  const fetchCategories = useCallback(async () => {
    if (!storeId) return;
    try {
      const { data } = await getCategories(storeId);
      setCategories(data.map((c) => ({ id: c.id, name: c.name })));
    } catch {
      // ignore
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = filterProducts(products, {
    search,
    category: showFilters ? category : "all",
    availability: showFilters ? availability : "all",
    priceMin: showFilters ? selectedRange.min : 0,
    priceMax: showFilters ? selectedRange.max : Number.POSITIVE_INFINITY,
  });

  return (
    <Box>
      <PageHeader subtitle="Browse your product catalog" />

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Scan barcode to search">
                    <IconButton size="small" onClick={() => setScannerOpen(true)}>
                      <QrCodeScannerOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant={showFilters ? "contained" : "outlined"}
          startIcon={<FilterListOutlined />}
          onClick={() => setShowFilters((visible) => !visible)}
          sx={{ textTransform: "none" }}
        >
          {showFilters ? "Hide filters" : "Show filters"}
        </Button>

        {showFilters && (
          <>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Price Range"
              value={priceRangeIdx}
              onChange={(e) => setPriceRangeIdx(Number(e.target.value))}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {PRICE_RANGES.map((range, idx) => (
                <MenuItem key={idx} value={idx}>
                  {range.label}
                </MenuItem>
              ))}
            </TextField>

            <ToggleButtonGroup
              value={availability}
              exclusive
              onChange={(_, val) => val && setAvailability(val)}
              size="small"
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <ToggleButton key={opt.value} value={opt.value}>
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </>
        )}
      </Box>

      {/* ── Product grid ───────────────────────────────────────────────────── */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No products match your {showFilters ? "filters" : "search"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} onClick={() => {}} />
            </Grid>
          ))}
        </Grid>
      )}
      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={(barcode) => {
          setSearch(barcode);
          setScannerOpen(false);
        }}
        onClose={() => setScannerOpen(false)}
      />
    </Box>
  );
}
