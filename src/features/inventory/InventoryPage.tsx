import {
  AssignmentReturnOutlined,
  CallReceivedOutlined,
  DeleteOutlined,
  LocalShippingOutlined,
  LockOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  buildInsightProducts,
  buildProductMovementRanks,
  buildStockMovementPoints,
  INVENTORY_PRODUCTS,
  STOCK_MOVEMENTS,
} from "./inventory.data";
import {
  InventoryFiltersBar,
  type InventoryFilters,
} from "./InventoryFiltersBar";
import { InventorySummaryBar } from "./InventorySummaryBar";
import { InventoryTable } from "./InventoryTable";
import { LowStockPanel } from "./LowStockPanel";
import { ProcessReturnModal } from "./ProcessReturnModal";
import { ReceiveStockModal } from "./ReceiveStockModal";
import { ReserveStockModal } from "./ReserveStockModal";
import { WriteOffModal } from "./WriteOffModal";
import { CreateIncomingModal } from "./CreateIncomingModal";
import { ArriveStockModal } from "./ArriveStockModal";
import { calcSummary, filterMovements } from "./inventory.utils";
import { InventoryChartControls } from "./InventoryChartControls";
import { InventoryStockChart } from "./InventoryStockChart";
import { InventoryMovementRanking } from "./InventoryMovementRanking";
import { InventoryInsightCards } from "./InventoryInsightCards";
import type { StockMovement, TimeRange } from "./inventory.types";

const DEFAULT_FILTERS: InventoryFilters = {
  search: "",
  category: "All Categories",
  brand: "All Brands",
  movementType: "All Types",
  staff: "All Staff",
  dateFrom: "",
  dateTo: "",
};

type ModalType = "receive" | "reserve" | "writeoff" | "return" | "incoming" | null;

export function InventoryPage() {
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [productNameFilter, setProductNameFilter] = useState<string[]>([]);
  const [incomingToArrive, setIncomingToArrive] = useState<StockMovement | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  // Chart state
  const [chartRange, setChartRange] = useState<TimeRange>("30D");
  const [chartCategory, setChartCategory] = useState<string>("");

  const summary = calcSummary(INVENTORY_PRODUCTS, STOCK_MOVEMENTS);
  const filtered = filterMovements(STOCK_MOVEMENTS, {
    ...filters,
    productNames: productNameFilter,
  });

  // Chart-specific derived data
  const stockMovementPoints = buildStockMovementPoints(
    STOCK_MOVEMENTS,
    chartRange,
    chartCategory,
  );
  const productRanks = buildProductMovementRanks(
    STOCK_MOVEMENTS,
    chartRange,
    chartCategory,
  );
  const { fastest, slowest } = buildInsightProducts(
    STOCK_MOVEMENTS,
    INVENTORY_PRODUCTS,
  );

  function handleLowStockClick() {
    const names = INVENTORY_PRODUCTS.filter(
      (p) => p.quantityOnHand > 0 && p.quantityOnHand <= p.reorderPoint,
    ).map((p) => p.productName);
    setProductNameFilter(names);
    setFilters(DEFAULT_FILTERS);
  }

  function handleOutOfStockClick() {
    const names = INVENTORY_PRODUCTS.filter((p) => p.quantityOnHand === 0).map(
      (p) => p.productName,
    );
    setProductNameFilter(names);
    setFilters(DEFAULT_FILTERS);
  }

  function handleFiltersChange(f: InventoryFilters) {
    // Changing any filter bar control clears the quick product-name filter
    setProductNameFilter([]);
    setFilters(f);
  }

  function handleArriveClick(movement: StockMovement) {
    setIncomingToArrive(movement);
  }

  function handleArriveConfirm(movementId: string, arrivedQuantity: number) {
    // TODO: call inventory API — update movement status and add to stock
    console.log("Arrive stock:", { movementId, arrivedQuantity });
    setIncomingToArrive(null);
  }

  return (
    <Box>
      <PageHeader
        title="Inventory"
        subtitle="Track all stock movements across your store"
      />

      {/* 1. Summary bar */}
      <InventorySummaryBar
        summary={summary}
        onLowStockClick={handleLowStockClick}
        onOutOfStockClick={handleOutOfStockClick}
      />

      {/* 2. Quick action buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3, alignItems: "center" }}>
        <Button
          variant="contained"
          startIcon={<CallReceivedOutlined />}
          onClick={() => setOpenModal("receive")}
        >
          Receive Stock
        </Button>
        <Button
          variant="outlined"
          startIcon={<LocalShippingOutlined />}
          onClick={() => setOpenModal("incoming")}
        >
          Create Incoming
        </Button>
        <IconButton
          onClick={(e) => setMoreAnchor(e.currentTarget)}
          size="small"
        >
          <MoreVertOutlined />
        </IconButton>
        <Menu
          anchorEl={moreAnchor}
          open={Boolean(moreAnchor)}
          onClose={() => setMoreAnchor(null)}
        >
          <MenuItem onClick={() => { setOpenModal("reserve"); setMoreAnchor(null); }}>
            <ListItemIcon><LockOutlined fontSize="small" /></ListItemIcon>
            <ListItemText>Reserve Stock</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setOpenModal("writeoff"); setMoreAnchor(null); }}>
            <ListItemIcon><DeleteOutlined fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>Write Off / Damaged</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setOpenModal("return"); setMoreAnchor(null); }}>
            <ListItemIcon><AssignmentReturnOutlined fontSize="small" /></ListItemIcon>
            <ListItemText>Process Return</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* 3. Filters bar */}
      <InventoryFiltersBar filters={filters} onChange={handleFiltersChange} />

      {/* 4. Charts & analytics section */}
      <Box sx={{ mt: 3, mb: 1 }}>
        <InventoryChartControls
          range={chartRange}
          category={chartCategory}
          onRangeChange={setChartRange}
          onCategoryChange={setChartCategory}
        />

        {/* Two charts side by side, stack on mobile */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <InventoryStockChart data={stockMovementPoints} />
          <InventoryMovementRanking data={productRanks} />
        </Box>

        {/* Insight cards */}
        <InventoryInsightCards fastest={fastest} slowest={slowest} />
      </Box>

      {/* 5. Stock movement table */}
      <InventoryTable movements={filtered} onArriveClick={handleArriveClick} />

      {/* 6. Low stock alert panel */}
      <LowStockPanel products={INVENTORY_PRODUCTS} />

      {/* 7. Action modals */}
      <ReceiveStockModal
        open={openModal === "receive"}
        onClose={() => setOpenModal(null)}
      />
      <CreateIncomingModal
        open={openModal === "incoming"}
        onClose={() => setOpenModal(null)}
      />
      <ReserveStockModal
        open={openModal === "reserve"}
        onClose={() => setOpenModal(null)}
      />
      <WriteOffModal
        open={openModal === "writeoff"}
        onClose={() => setOpenModal(null)}
      />
      <ProcessReturnModal
        open={openModal === "return"}
        onClose={() => setOpenModal(null)}
      />
      <ArriveStockModal
        open={incomingToArrive !== null}
        incoming={incomingToArrive}
        onClose={() => setIncomingToArrive(null)}
        onConfirm={handleArriveConfirm}
      />
    </Box>
  );
}
