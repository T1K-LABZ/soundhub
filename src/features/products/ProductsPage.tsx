import { CategoryOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { AddProductModal } from "./AddProductModal";
import { CategoryModal } from "./CategoryModal";
import { ProductCard } from "./ProductCard";
import { AVAILABILITY_OPTIONS, PRICE_RANGES } from "./products.constants";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./products.data";
import type { AvailabilityFilter, Category, Product } from "./products.types";
import { filterProducts } from "./products.utils";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [priceRangeIdx, setPriceRangeIdx] = useState(0);

  // Modal state
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const selectedRange = PRICE_RANGES[priceRangeIdx];

  const filtered = filterProducts(products, {
    search,
    category,
    availability,
    priceMin: selectedRange.min,
    priceMax: selectedRange.max,
  });

  function handleAddCategory(cat: Category) {
    setCategories((prev) => [...prev, cat]);
  }

  function handleDeleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function handleProductClick(_product: Product) {
    // TODO: open product detail / edit modal
  }

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products across ${categories.length} categories`}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CategoryOutlined />}
              onClick={() => setCategoryModalOpen(true)}
            >
              Categories
            </Button>
            <Button variant="contained" onClick={() => setAddProductOpen(true)}>
              Add Product
            </Button>
          </Box>
        }
      />

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {/* Search */}
        <TextField
          placeholder="Search products…"
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
            },
          }}
        />

        {/* Category filter */}
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

        {/* Price range filter */}
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

        {/* Availability toggle */}
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
      </Box>

      {/* ── Product grid ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No products match your filters
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} onClick={handleProductClick} />
            </Grid>
          ))}
        </Grid>
      )}

      <AddProductModal
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      <CategoryModal
        open={categoryModalOpen}
        categories={categories}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        onClose={() => setCategoryModalOpen(false)}
      />
    </Box>
  );
}
