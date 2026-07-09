import {
  AddOutlined,
  CategoryOutlined,
  CallReceivedOutlined,
  LocalShippingOutlined,
  Inventory2Outlined,
  QrCodeScannerOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { AddProductModal } from "../products/AddProductModal";
import { CategoryModal } from "../products/CategoryModal";
import { getCategories, getItemByBarcode, getItems, mapItemToProduct } from "../products/products.api";
import type { Category, Product } from "../products/products.types";
import { useBatchesQuery } from "./inventory.api";
import { ProductStockCard } from "./ProductStockCard";
import { BatchList } from "./BatchList";
import { QuickReceiveModal } from "./QuickReceiveModal";
import { ReceiveStockModal } from "./ReceiveStockModal";
import { CreateIncomingModal } from "./CreateIncomingModal";
import { ProductDetailModal } from "./ProductDetailModal";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";

const PAGE_SIZE = 24;

export function InventoryPage() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [batchTab, setBatchTab] = useState(0);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [receiveProduct, setReceiveProduct] = useState<Product | null>(null);
  const [bulkReceiveOpen, setBulkReceiveOpen] = useState(false);
  const [createIncomingOpen, setCreateIncomingOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const isEditing = Boolean(editProductId);
  const productModalOpen = addProductOpen || isEditing;
  const editingProduct = editProductId ? products.find((p) => p.id === editProductId) ?? null : null;

  const { data: inTransitBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "IN_TRANSIT");
  const { data: pendingBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "PENDING");
  const { data: activeBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "ACTIVE");

  const searchRef = useRef(search);
  useEffect(() => { searchRef.current = search; });

  const loadPage = useCallback(async (pageNum: number, append: boolean) => {
    if (!storeId) return;
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const { data } = await getItems(storeId, {
        search: searchRef.current || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
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
  }, [storeId, categoryFilter]);

  // Fetch page 1 when search or category filter changes or on mount
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadPage(1, false);
  }, [search, categoryFilter, loadPage]);

  // Fetch categories for the filter dropdown
  useEffect(() => {
    if (!storeId) return;
    getCategories(storeId)
      .then(({ data }) => {
        setCategories(data.map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => {});
  }, [storeId]);

  function refreshProducts() {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadPage(1, false);
  }

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    loadPage(next, true);
  }

  function handleQuickReceive(productId: string, quantity: number) {
    console.log("Quick receive:", { productId, quantity });
    setReceiveProduct(null);
    refreshProducts();
  }

  const lowStockCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold,
  ).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;
  const totalIncoming = inTransitBatches.total + pendingBatches.total;

  const displayedProducts = products.filter((p) => {
    if (stockFilter === "low" && (p.stockQuantity === 0 || p.stockQuantity > p.lowStockThreshold)) return false;
    if (stockFilter === "out" && p.stockQuantity !== 0) return false;
    if (stockFilter === "in" && p.stockQuantity === 0) return false;
    return true;
  });

  return (
    <Box sx={{ pb: { xs: 3, md: 4 } }}>
      <PageHeader
        subtitle="Manage products, stock, and incoming shipments"
        action={
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "auto auto" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CategoryOutlined />}
              onClick={() => setCategoryModalOpen(true)}
              sx={{ minHeight: 40 }}
            >
              Categories
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setAddProductOpen(true)}
              sx={{ minHeight: 40 }}
            >
              Add Product
            </Button>
          </Box>
        }
      />

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
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
          <Chip icon={<Inventory2Outlined />} label={`${products.length.toLocaleString()} Products`} variant="outlined" sx={{ justifyContent: "flex-start" }} />
          <Chip icon={<CallReceivedOutlined />} label={`${lowStockCount.toLocaleString()} Low Stock`} color="warning" variant="outlined" sx={{ justifyContent: "flex-start" }} />
          <Chip icon={<Inventory2Outlined />} label={`${outOfStockCount.toLocaleString()} Out of Stock`} color="error" variant="outlined" sx={{ justifyContent: "flex-start" }} />
          <Chip icon={<LocalShippingOutlined />} label={`${totalIncoming.toLocaleString()} Incoming`} color="info" variant="outlined" sx={{ justifyContent: "flex-start" }} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "minmax(260px, 1fr) 180px 180px" },
            gap: 1.25,
          }}
        >
          <TextField
            placeholder="Search by name or barcode..."
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
                endAdornment: search ? undefined : (
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
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            label="Stock Status"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="all">All Stock</MenuItem>
            <MenuItem value="in">In Stock</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="out">Out of Stock</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          mb: { xs: 2, md: 3 },
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 44,
          "& .MuiTab-root": {
            minHeight: 44,
            px: { xs: 1.5, sm: 2 },
            textTransform: "none",
            fontWeight: 700,
          },
        }}
      >
        <Tab label={`Products (${products.length.toLocaleString()})`} />
        <Tab label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Incoming Stock
            {totalIncoming > 0 && <Chip label={totalIncoming.toLocaleString()} size="small" color="info" />}
          </Box>
        } />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "auto auto" },
              gap: 1,
              mb: { xs: 2, md: 3 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CallReceivedOutlined />}
              onClick={() => setBulkReceiveOpen(true)}
              sx={{ minHeight: 40 }}
            >
              Receive Stock
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocalShippingOutlined />}
              onClick={() => setCreateIncomingOpen(true)}
              sx={{ minHeight: 40 }}
            >
              Create Incoming
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : displayedProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Inventory2Outlined sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No products found
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                {displayedProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ProductStockCard
                      product={product}
                      onEdit={(p) => setEditProductId(p.id)}
                      onReceive={(p) => setReceiveProduct(p)}
                      onClick={(p) => setViewProduct(p)}
                    />
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
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Tabs
            value={batchTab}
            onChange={(_, v) => setBatchTab(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              mb: 2,
              minHeight: 42,
              "& .MuiTab-root": {
                minHeight: 42,
                px: { xs: 1.5, sm: 2 },
                textTransform: "none",
                fontWeight: 700,
              },
            }}
          >
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                In Transit
                {inTransitBatches.total > 0 && <Chip label={inTransitBatches.total.toLocaleString()} size="small" color="info" />}
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Pending
                {pendingBatches.total > 0 && <Chip label={pendingBatches.total.toLocaleString()} size="small" color="warning" />}
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Active
                {activeBatches.total > 0 && <Chip label={activeBatches.total.toLocaleString()} size="small" color="success" />}
              </Box>
            } />
          </Tabs>

          {batchTab === 0 && <BatchList batches={inTransitBatches.items} />}
          {batchTab === 1 && <BatchList batches={pendingBatches.items} />}
          {batchTab === 2 && <BatchList batches={activeBatches.items} />}
        </Box>
      )}

      <AddProductModal
        open={productModalOpen}
        onClose={() => {
          setAddProductOpen(false);
          setEditProductId(null);
          refreshProducts();
        }}
        productId={editProductId ?? undefined}
        product={editingProduct}
      />
      <CategoryModal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
      <QuickReceiveModal
        open={Boolean(receiveProduct)}
        product={receiveProduct}
        onClose={() => setReceiveProduct(null)}
        onConfirm={handleQuickReceive}
      />
      <ReceiveStockModal open={bulkReceiveOpen} onClose={() => setBulkReceiveOpen(false)} />
      <CreateIncomingModal open={createIncomingOpen} onClose={() => setCreateIncomingOpen(false)} />
      <ProductDetailModal
        product={viewProduct}
        open={Boolean(viewProduct)}
        onClose={() => setViewProduct(null)}
        storeId={storeId}
      />
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
