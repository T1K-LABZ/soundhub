import { Search, Tune } from "@mui/icons-material";
import {
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { categoryOf, money } from "../storefront.utils";
import {
  useStorefrontCategories,
  useStorefrontProducts,
} from "./useStorefrontProducts";

type SortOrder = "featured" | "price-low" | "price-high";

// ── Shared filter panel content ───────────────────────────────────────────
// Defined outside CataloguePage so React never treats it as a new component
// type on re-render (which would cause input focus loss).

type FilterPanelProps = {
  search: string;
  onSearch: (v: string) => void;
  categories: string[];
  category: string;
  onCategory: (v: string) => void;
  brands: string[];
  brand: string;
  onBrand: (v: string) => void;
  maxPrice: number;
  onMaxPrice: (v: number) => void;
};

function FilterPanel({
  search,
  onSearch,
  categories,
  category,
  onCategory,
  brands,
  brand,
  onBrand,
  maxPrice,
  onMaxPrice,
}: FilterPanelProps) {
  return (
    <>
      <TextField
        fullWidth
        size="small"
        placeholder="Search products"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
      />
      <Divider />

      <p className="filter-label">Category</p>
      <div className="filter-chips">
        {categories.map((item) => (
          <button
            key={item}
            className={`filter-chip${category === item ? " active" : ""}`}
            onClick={() => onCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <Divider />
      <p className="filter-label">Brand</p>
      <div className="filter-chips">
        {brands.map((item) => (
          <button
            key={item}
            className={`filter-chip${brand === item ? " active" : ""}`}
            onClick={() => onBrand(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <Divider />
      <p className="filter-label">Maximum price</p>
      <Slider
        value={maxPrice}
        min={0}
        max={150000}
        step={5000}
        onChange={(_, v) => onMaxPrice(v as number)}
      />
      <b>{money(maxPrice)} or less</b>
    </>
  );
}

// ── CataloguePage ─────────────────────────────────────────────────────────

export function CataloguePage() {
  const { data = [], isLoading } = useStorefrontProducts();
  const { data: categoryData = [] } = useStorefrontCategories();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = params.get("category") ?? "All";
  const categories = ["All", ...categoryData.map((c) => c.name)];
  const brands = [
    "All",
    ...Array.from(
      new Set(data.map((item) => item.brand ?? "Recoil").filter(Boolean)),
    ),
  ];

  const products = useMemo(
    () =>
      data
        .filter(
          (p) =>
            (category === "All" || categoryOf(p) === category) &&
            (brand === "All" || (p.brand ?? "Recoil") === brand) &&
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            Number(p.sellingPrice) <= maxPrice,
        )
        .sort((a, b) =>
          sort === "price-low"
            ? Number(a.sellingPrice) - Number(b.sellingPrice)
            : sort === "price-high"
              ? Number(b.sellingPrice) - Number(a.sellingPrice)
              : 0,
        ),
    [data, category, brand, search, maxPrice, sort],
  );

  function chooseCategory(value: string) {
    setParams(value === "All" ? {} : { category: value });
  }

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (brand !== "All" ? 1 : 0) +
    (maxPrice < 150000 ? 1 : 0) +
    (search ? 1 : 0);

  const productLabel = isLoading
    ? "Loading…"
    : `${products.length} product${products.length !== 1 ? "s" : ""}`;

  const sharedFilterProps: FilterPanelProps = {
    search,
    onSearch: setSearch,
    categories,
    category,
    onCategory: chooseCategory,
    brands,
    brand,
    onBrand: setBrand,
    maxPrice,
    onMaxPrice: setMaxPrice,
  };

  return (
    <main className="catalogue">
      <div className="catalogue-title">
        <p className="eyebrow">The Recoil collection</p>
        <h1>Built to be heard.</h1>
        <p>Explore genuine Recoil car audio for every kind of driver.</p>
      </div>

      <div className="catalogue-layout">
        {/* ── Desktop sidebar ── */}
        <aside className="filter-panel">
          <div className="filter-title">
            <Tune /> Filters
          </div>
          <FilterPanel {...sharedFilterProps} />
        </aside>

        <div className="catalogue-content">
          {/* ── Mobile top bar (Filters button + sort) ── */}
          <div className="mobile-filter-bar">
            <button
              className="mobile-filter-btn"
              onClick={() => setDrawerOpen(true)}
            >
              <Tune fontSize="small" />
              Filters
              {activeFilterCount > 0 && (
                <span className="mobile-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <span style={{ fontSize: 13, color: "#888" }}>{productLabel}</span>

            <FormControl size="small">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price ↑</MenuItem>
                <MenuItem value="price-high">Price ↓</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* ── Desktop result / sort bar ── */}
          <div className="catalogue-result">
            <span>{productLabel}</span>
            <FormControl size="small">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: low to high</MenuItem>
                <MenuItem value="price-high">Price: high to low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>

      {/* ── Mobile bottom-sheet filter drawer ── */}
      <div
        className={`filter-drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`filter-drawer${drawerOpen ? " open" : ""}`}>
        <div className="filter-drawer-handle" />
        <div className="filter-drawer-header">
          <h3>Filters</h3>
          <button
            className="filter-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        <FilterPanel {...sharedFilterProps} />

        <button
          className="filter-drawer-apply"
          onClick={() => setDrawerOpen(false)}
        >
          Show {productLabel}
        </button>
      </div>
    </main>
  );
}
