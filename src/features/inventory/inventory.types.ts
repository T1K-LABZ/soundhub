export type MovementType =
  | "Stock In"
  | "Stock Out"
  | "Reserved"
  | "Damaged"
  | "Return";

export type StockMovement = {
  id: string;
  dateTime: string; // ISO string
  productName: string;
  brand: string;
  serial: string;
  category: string;
  movementType: MovementType;
  quantity: number; // positive = in, negative = out
  reason: string;
  staff: string;
  runningBalance: number;
  supplier?: string;
  customerRef?: string;
  condition?: string;
};

export type InventoryProduct = {
  productId: string;
  productName: string;
  brand: string;
  serial: string;
  category: string;
  barcode: string;
  quantityOnHand: number;
  reorderPoint: number;
  buyingPrice: number;
  sellingPrice: number;
};

export type InventorySummary = {
  totalCostValue: number;
  totalRetailValue: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  mostMovedProduct: string;
};

export type ReceiveStockForm = {
  productId: string;
  quantity: number;
  supplier: string;
  dateReceived: string;
  notes: string;
  receivedBy: string;
};

// ── Batch receiving ───────────────────────────────────────────────────────────

export type StockBatchItem = {
  id: string; // local key for React list rendering
  productId: string;
  quantity: number;
  buyingPrice: number; // price this batch was purchased at
  sellingPrice: number; // price this batch will be sold at (may differ from existing stock)
};

// The full "Receive Stock" payload — one delivery, multiple product lines
export type BatchReceiveForm = {
  supplier: string;
  dateReceived: string;
  receivedBy: string;
  notes: string;
  items: StockBatchItem[];
};

export type ReserveStockForm = {
  productId: string;
  quantity: number;
  customerRef: string;
  dateNeeded: string;
  reservedBy: string;
};

export type WriteOffForm = {
  productId: string;
  quantity: number;
  faultDescription: string;
  actionTaken: "Written Off" | "Return to Supplier" | "Repair" | "Warranty";
  date: string;
  loggedBy: string;
};

export type ProcessReturnForm = {
  productId: string;
  quantity: number;
  reason: string;
  condition: "Resellable" | "Damaged" | "Faulty";
  date: string;
  processedBy: string;
};

// ── Chart types ──────────────────────────────────────────────────────────────

export type TimeRange = "7D" | "30D" | "90D";

export type StockMovementPoint = {
  date: string; // e.g. "May 6"
  stockIn: number;
  stockOut: number;
};

export type ProductMovementRank = {
  productName: string;
  shortName: string; // truncated label for the bar chart
  category: string;
  totalMoved: number;
};

export type InsightProduct = {
  productName: string;
  brand: string;
  unitsMoved: number;
};
