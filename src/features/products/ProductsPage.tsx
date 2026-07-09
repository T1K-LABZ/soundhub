import {
  FilterListOutlined,
  Inventory2Outlined,
  QrCodeScannerOutlined,
  SearchOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { ProductCard } from "./ProductCard";
import { PRICE_RANGES } from "./products.constants";
import type { AvailabilityFilter, Category, Product } from "./products.types";
import { getCategories, getItemByBarcode, getItems, mapItemToProduct } from "./products.api";
import { filterProducts, getStockStatus } from "./products.utils";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";

const PAGE_SIZE = 24;

export function ProductsPage() {
  const storeId = useAuthStore((s) => s.user?.storeId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [priceRangeIdx, setPriceRangeIdx] = useState(0);

  const selectedRange = PRICE_RANGES[priceRangeIdx];

  const loadPage = useCallback(async (pageNum: number, append: boolean) => {
    if (!storeId) return;
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const { data } = await getItems(storeId, {
        search: search || undefined,
        page: pageNum,
        pageSize: PAGE_SIZE,
      });
      const mapped = data.map(mapItemToProduct);
      if (append) {
        setProducts((prev) => [...prev, ...mapped]);
      } else {
        setProducts(mapped);
      }
      setHasMore(mapped.length === PAGE_SIZE);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [storeId, search]);

  // Fetch page 1 whenever search changes, resetting previous results.
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadPage(1, false);
  }, [loadPage]);

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
    fetchCategories();
  }, [fetchCategories]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, true);
  }

  function handleAvailabilityClick(value: AvailabilityFilter) {
    setAvailability(value);
  }

  const filtered = filterProducts(products, {
    search,
    category: showFilters ? category : "all",
    availability,
    priceMin: showFilters ? selectedRange.min : 0,
    priceMax: showFilters ? selectedRange.max : Number.POSITIVE_INFINITY,
  });

  const inStockCount = products.filter((product) => getStockStatus(product) === "in_stock").length;
  const lowStockCount = products.filter((product) => getStockStatus(product) === "low_stock").length;
  const outOfStockCount = products.filter((product) => getStockStatus(product) === "out_of_stock").length;
  const visibleFilterCount = [
    category !== "all",
    availability !== "all",
    priceRangeIdx !== 0,
  ].filter(Boolean).length;

  return (
    <Box sx={{ pb: { xs: 3, md: 4 } }}>
      <PageHeader subtitle="Browse your product catalog" />

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 2, md: 3 },
          borderColor: "rgba(31, 41, 51, 0.08)",
          boxShadow: { xs: "0 10px 30px rgba(31, 41, 51, 0.05)", md: "none" },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, auto)" },
            gap: 1,
            mb: 1.5,
          }}
        >
          <Chip
            clickable
            icon={<Inventory2Outlined />}
            label={`${products.length.toLocaleString()} All`}
            variant={availability === "all" ? "filled" : "outlined"}
            onClick={() => handleAvailabilityClick("all")}
            sx={{ justifyContent: "flex-start", fontWeight: 700 }}
          />
          <Chip
            clickable
            icon={<Inventory2Outlined />}
            label={`${inStockCount.toLocaleString()} In Stock`}
            color="success"
            variant={availability === "in_stock" ? "filled" : "outlined"}
            onClick={() => handleAvailabilityClick("in_stock")}
            sx={{ justifyContent: "flex-start", fontWeight: 700 }}
          />
          <Chip
            clickable
            icon={<WarningAmberOutlined />}
            label={`${lowStockCount.toLocaleString()} Low Stock`}
            color="warning"
            variant={availability === "low_stock" ? "filled" : "outlined"}
            onClick={() => handleAvailabilityClick("low_stock")}
            sx={{ justifyContent: "flex-start", fontWeight: 700 }}
          />
          <Chip
            clickable
            icon={<Inventory2Outlined />}
            label={`${outOfStockCount.toLocaleString()} Out`}
            color="error"
            variant={availability === "out_of_stock" ? "filled" : "outlined"}
            onClick={() => handleAvailabilityClick("out_of_stock")}
            sx={{ justifyContent: "flex-start", fontWeight: 700 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "minmax(260px, 1fr) auto" },
            gap: 1.25,
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search products or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
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
            sx={{
              minHeight: 40,
              px: 2,
              whiteSpace: "nowrap",
            }}
          >
            {showFilters ? `Filters${visibleFilterCount ? ` (${visibleFilterCount})` : ""}` : "Filters"}
          </Button>
        </Box>

        {showFilters && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "180px 220px" },
              gap: 1.25,
              alignItems: "center",
              mt: 1.5,
              pt: 1.5,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
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
              fullWidth
            >
              {PRICE_RANGES.map((range, idx) => (
                <MenuItem key={idx} value={idx}>
                  {range.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No products match your {showFilters || availability !== "all" ? "filters" : "search"}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {filtered.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} onClick={() => {}} />
              </Grid>
            ))}
          </Grid>

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{ textTransform: "none", minWidth: 200 }}
              >
                {loadingMore ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                {loadingMore ? "Loading…" : "Next Page"}
              </Button>
            </Box>
          )}
        </>
      )}
      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={async (barcode) => {
          setScannerOpen(false);
          if (storeId) {
            const item = await getItemByBarcode(storeId, barcode);
            setSearch(item ? item.name : barcode);
          } else {
            setSearch(barcode);
          }
        }}
        onClose={() => setScannerOpen(false)}
      />
    </Box>
  );
}
