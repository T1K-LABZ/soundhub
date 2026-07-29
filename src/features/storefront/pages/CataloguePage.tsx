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

export function CataloguePage() {
  const { data = [], isLoading } = useStorefrontProducts();
  const { data: categoryData = [] } = useStorefrontCategories();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<SortOrder>("featured");
  const category = params.get("category") ?? "All";
  const categories = ["All", ...categoryData.map((category) => category.name)];
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
          (product) =>
            (category === "All" || categoryOf(product) === category) &&
            (brand === "All" || (product.brand ?? "Recoil") === brand) &&
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            Number(product.sellingPrice) <= maxPrice,
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
  const chooseCategory = (value: string) =>
    setParams(value === "All" ? {} : { category: value });
  return (
    <main className="catalogue">
      <div className="catalogue-title">
        <p className="eyebrow">The Recoil collection</p>
        <h1>Built to be heard.</h1>
        <p>Explore genuine Recoil car audio for every kind of driver.</p>
      </div>
      <div className="catalogue-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <Tune /> Filters
          </div>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
          {categories.map((item) => (
            <button
              className={
                category === item ? "filter-option active" : "filter-option"
              }
              onClick={() => chooseCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
          <Divider />
          <p className="filter-label">Brand</p>
          {brands.map((item) => (
            <button
              className={
                brand === item ? "filter-option active" : "filter-option"
              }
              onClick={() => setBrand(item)}
              key={item}
            >
              {item}
            </button>
          ))}
          <Divider />
          <p className="filter-label">Maximum price</p>
          <Slider
            value={maxPrice}
            min={0}
            max={150000}
            step={5000}
            onChange={(_, value) => setMaxPrice(value as number)}
          />
          <b>{money(maxPrice)} or less</b>
        </aside>
        <div className="catalogue-content">
          <div className="catalogue-result">
            <span>
              {isLoading
                ? "Loading products..."
                : `${products.length} products`}
            </span>
            <FormControl size="small">
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOrder)}
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
    </main>
  );
}
