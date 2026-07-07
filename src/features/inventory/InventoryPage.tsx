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
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { AddProductModal } from "../products/AddProductModal";
import { CategoryModal } from "../products/CategoryModal";
import { getItemByBarcode, getItems, mapItemToProduct } from "../products/products.api";
import type { Product } from "../products/products.types";
import { useBatchesQuery } from "./inventory.api";
import type { BatchItem } from "./inventory.api";
import { ProductStockCard } from "./ProductStockCard";
import { BatchList } from "./BatchList";
import { QuickReceiveModal } from "./QuickReceiveModal";
import { ReceiveStockModal } from "./ReceiveStockModal";
import { CreateIncomingModal } from "./CreateIncomingModal";
import { ProductDetailModal } from "./ProductDetailModal";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";

export function InventoryPage() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [batchTab, setBatchTab] = useState(0);

  // Modal state
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [receiveProduct, setReceiveProduct] = useState<Product | null>(null);
  const [bulkReceiveOpen, setBulkReceiveOpen] = useState(false);
  const [createIncomingOpen, setCreateIncomingOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Determine modal mode
  const isEditing = Boolean(editProductId);
  const productModalOpen = addProductOpen || isEditing;
  const editingProduct = editProductId ? products.find((p) => p.id === editProductId) ?? null : null;

  // Batch queries
  const { data: inTransitBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "IN_TRANSIT");
  const { data: pendingBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "PENDING");
  const { data: activeBatches = { items: [], total: 0 } } = useBatchesQuery(storeId, "ACTIVE");

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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleQuickReceive(productId: string, quantity: number) {
    console.log("Quick receive:", { productId, quantity });
    setReceiveProduct(null);
    fetchProducts();
  }

  const lowStockCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold,
  ).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;
  const totalIncoming = inTransitBatches.total + pendingBatches.total;

  return (
    <Box>
      <PageHeader
        subtitle="Manage products, stock, and incoming shipments"
        action={
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button variant="outlined" startIcon={<CategoryOutlined />} onClick={() => setCategoryModalOpen(true)}>
              Categories
            </Button>
            <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setAddProductOpen(true)}>
              Add Product
            </Button>
          </Box>
        }
      />

      {/* Summary chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
        <Chip icon={<Inventory2Outlined />} label={`${products.length.toLocaleString()} Products`} variant="outlined" />
        <Chip icon={<CallReceivedOutlined />} label={`${lowStockCount.toLocaleString()} Low Stock`} color="warning" variant="outlined" />
        <Chip icon={<Inventory2Outlined />} label={`${outOfStockCount.toLocaleString()} Out of Stock`} color="error" variant="outlined" />
        <Chip icon={<LocalShippingOutlined />} label={`${totalIncoming.toLocaleString()} Incoming`} color="info" variant="outlined" />
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by name or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
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
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Button variant="outlined" startIcon={<CallReceivedOutlined />} onClick={() => setBulkReceiveOpen(true)}>
              Receive Stock
            </Button>
            <Button variant="outlined" startIcon={<LocalShippingOutlined />} onClick={() => setCreateIncomingOpen(true)}>
              Create Incoming
            </Button>
          </Box>

          {/* Product grid */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Inventory2Outlined sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No products found
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
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
          )}
        </Box>
      )}

      {/* Tab 1: Incoming Stock */}
      {tab === 1 && (
        <Box>
          <Tabs value={batchTab} onChange={(_, v) => setBatchTab(v)} sx={{ mb: 2 }}>
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

      {/* Modals */}
      <AddProductModal
        open={productModalOpen}
        onClose={() => {
          setAddProductOpen(false);
          setEditProductId(null);
          fetchProducts();
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
