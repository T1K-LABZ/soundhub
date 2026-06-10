import type {
  InventoryProduct,
  InsightProduct,
  ProductMovementRank,
  StockMovement,
  StockMovementPoint,
  TimeRange,
} from "./inventory.types";

export const INVENTORY_PRODUCTS: InventoryProduct[] = [
  {
    productId: "ip1",
    productName: 'Alpine X-Series 12" Subwoofer',
    brand: "Alpine",
    serial: "ALP-X12-SW",
    category: "Subwoofers",
    barcode: "0888283008924",
    quantityOnHand: 14,
    reorderPoint: 5,
    buyingPrice: 18500,
    sellingPrice: 24000,
  },
  {
    productId: "ip2",
    productName: "Pioneer AVH-Z9250BT Double DIN",
    brand: "Pioneer",
    serial: "PIO-AVH-Z9250",
    category: "Head Units",
    barcode: "0012562553972",
    quantityOnHand: 3,
    reorderPoint: 4,
    buyingPrice: 32000,
    sellingPrice: 42000,
  },
  {
    productId: "ip3",
    productName: "JL Audio 4-Channel Amplifier XD400/4",
    brand: "JL Audio",
    serial: "JLA-XD400-4",
    category: "Amplifiers",
    barcode: "0699235000420",
    quantityOnHand: 0,
    reorderPoint: 3,
    buyingPrice: 28000,
    sellingPrice: 36000,
  },
  {
    productId: "ip4",
    productName: "Sony XS-FB6930 6x9 Speakers",
    brand: "Sony",
    serial: "SNY-FB6930",
    category: "Speakers",
    barcode: "0027242916258",
    quantityOnHand: 22,
    reorderPoint: 8,
    buyingPrice: 5500,
    sellingPrice: 7800,
  },
  {
    productId: "ip5",
    productName: "Kenwood KDC-BT950DAB Head Unit",
    brand: "Kenwood",
    serial: "KNW-BT950DAB",
    category: "Head Units",
    barcode: "0019048190734",
    quantityOnHand: 2,
    reorderPoint: 4,
    buyingPrice: 14000,
    sellingPrice: 19500,
  },
  {
    productId: "ip6",
    productName: 'Alpine SPG-17CS 6.5" Component Kit',
    brand: "Alpine",
    serial: "ALP-SPG17CS",
    category: "Speakers",
    barcode: "0888283012143",
    quantityOnHand: 9,
    reorderPoint: 5,
    buyingPrice: 9500,
    sellingPrice: 13500,
  },
  {
    productId: "ip7",
    productName: 'Pioneer TS-SW3002S4 12" Shallow Sub',
    brand: "Pioneer",
    serial: "PIO-TSW3002",
    category: "Subwoofers",
    barcode: "0012562556577",
    quantityOnHand: 0,
    reorderPoint: 3,
    buyingPrice: 12500,
    sellingPrice: 17000,
  },
  {
    productId: "ip8",
    productName: 'JL Audio C2-650X 6.5" Coaxial',
    brand: "JL Audio",
    serial: "JLA-C2650X",
    category: "Speakers",
    barcode: "0699235220117",
    quantityOnHand: 18,
    reorderPoint: 6,
    buyingPrice: 7800,
    sellingPrice: 11000,
  },
  {
    productId: "ip9",
    productName: "Stinger 8GA 20ft RCA Wiring Kit",
    brand: "Stinger",
    serial: "STG-8GA-RCA20",
    category: "Wiring Kits",
    barcode: "0085809000010",
    quantityOnHand: 4,
    reorderPoint: 6,
    buyingPrice: 3200,
    sellingPrice: 4800,
  },
  {
    productId: "ip10",
    productName: 'Kenwood KFC-E174 6.5" Tweeters',
    brand: "Kenwood",
    serial: "KNW-KFC-E174",
    category: "Tweeters",
    barcode: "0019048234567",
    quantityOnHand: 11,
    reorderPoint: 5,
    buyingPrice: 2800,
    sellingPrice: 4200,
  },
];

export const STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "sm1",
    dateTime: "2026-06-05T09:15:00Z",
    productName: 'Alpine X-Series 12" Subwoofer',
    brand: "Alpine",
    serial: "ALP-X12-SW",
    category: "Subwoofers",
    movementType: "Stock In",
    quantity: 20,
    reason: "Regular restock from supplier",
    staff: "James Otieno",
    runningBalance: 14,
    supplier: "Alpine Distributors EA",
  },
  {
    id: "sm2",
    dateTime: "2026-06-05T11:30:00Z",
    productName: "JL Audio 4-Channel Amplifier XD400/4",
    brand: "JL Audio",
    serial: "JLA-XD400-4",
    category: "Amplifiers",
    movementType: "Stock Out",
    quantity: -2,
    reason: "Sold — Invoice INV-003",
    staff: "Faith Wanjiku",
    runningBalance: 0,
  },
  {
    id: "sm3",
    dateTime: "2026-06-04T14:00:00Z",
    productName: "Pioneer AVH-Z9250BT Double DIN",
    brand: "Pioneer",
    serial: "PIO-AVH-Z9250",
    category: "Head Units",
    movementType: "Reserved",
    quantity: -1,
    reason: "Reserved for John Kamau — Toyota Land Cruiser job",
    staff: "Brian Mwangi",
    runningBalance: 3,
    customerRef: "John Kamau / LC200-006",
  },
  {
    id: "sm4",
    dateTime: "2026-06-04T09:45:00Z",
    productName: "Sony XS-FB6930 6x9 Speakers",
    brand: "Sony",
    serial: "SNY-FB6930",
    category: "Speakers",
    movementType: "Stock In",
    quantity: 30,
    reason: "Bulk order — promotional season stock",
    staff: "Admin",
    runningBalance: 22,
    supplier: "Sony Kenya Ltd",
  },
  {
    id: "sm5",
    dateTime: "2026-06-03T16:20:00Z",
    productName: "Kenwood KDC-BT950DAB Head Unit",
    brand: "Kenwood",
    serial: "KNW-BT950DAB",
    category: "Head Units",
    movementType: "Damaged",
    quantity: -1,
    reason: "Display cracked during transit",
    staff: "James Otieno",
    runningBalance: 2,
  },
  {
    id: "sm6",
    dateTime: "2026-06-03T10:10:00Z",
    productName: 'Alpine SPG-17CS 6.5" Component Kit',
    brand: "Alpine",
    serial: "ALP-SPG17CS",
    category: "Speakers",
    movementType: "Stock Out",
    quantity: -3,
    reason: "Sold — Invoice INV-001",
    staff: "Faith Wanjiku",
    runningBalance: 9,
  },
  {
    id: "sm7",
    dateTime: "2026-06-02T15:00:00Z",
    productName: "Stinger 8GA 20ft RCA Wiring Kit",
    brand: "Stinger",
    serial: "STG-8GA-RCA20",
    category: "Wiring Kits",
    movementType: "Return",
    quantity: 2,
    reason: "Customer returned — wrong spec ordered",
    staff: "Brian Mwangi",
    runningBalance: 4,
    condition: "Resellable",
  },
  {
    id: "sm8",
    dateTime: "2026-06-02T11:00:00Z",
    productName: 'JL Audio C2-650X 6.5" Coaxial',
    brand: "JL Audio",
    serial: "JLA-C2650X",
    category: "Speakers",
    movementType: "Stock In",
    quantity: 10,
    reason: "Top-up order",
    staff: "Admin",
    runningBalance: 18,
    supplier: "JL Audio Nairobi",
  },
  {
    id: "sm9",
    dateTime: "2026-06-01T13:30:00Z",
    productName: 'Pioneer TS-SW3002S4 12" Shallow Sub',
    brand: "Pioneer",
    serial: "PIO-TSW3002",
    category: "Subwoofers",
    movementType: "Stock Out",
    quantity: -4,
    reason: "Sold — Invoice INV-002",
    staff: "Faith Wanjiku",
    runningBalance: 0,
  },
  {
    id: "sm10",
    dateTime: "2026-06-01T09:00:00Z",
    productName: 'Kenwood KFC-E174 6.5" Tweeters',
    brand: "Kenwood",
    serial: "KNW-KFC-E174",
    category: "Tweeters",
    movementType: "Stock In",
    quantity: 15,
    reason: "New season stock",
    staff: "James Otieno",
    runningBalance: 11,
    supplier: "Kenwood Distributors",
  },
  {
    id: "sm11",
    dateTime: "2026-05-31T14:45:00Z",
    productName: 'Alpine X-Series 12" Subwoofer',
    brand: "Alpine",
    serial: "ALP-X12-SW",
    category: "Subwoofers",
    movementType: "Stock Out",
    quantity: -6,
    reason: "Sold — Invoice INV-004",
    staff: "Brian Mwangi",
    runningBalance: 8,
  },
  {
    id: "sm12",
    dateTime: "2026-05-30T10:20:00Z",
    productName: "Sony XS-FB6930 6x9 Speakers",
    brand: "Sony",
    serial: "SNY-FB6930",
    category: "Speakers",
    movementType: "Damaged",
    quantity: -2,
    reason: "Cone punctured — warehouse mishandling",
    staff: "James Otieno",
    runningBalance: 24,
  },
];

// ── Chart data helpers ────────────────────────────────────────────────────────

// Returns the number of days for a given time range toggle
function rangeToDays(range: TimeRange): number {
  if (range === "7D") return 7;
  if (range === "90D") return 90;
  return 30;
}

// Formats a Date to a short readable label like "Jun 1"
function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/**
 * Builds daily Stock In / Stock Out totals for the line chart.
 * Accepts optional category filter ("" = all).
 */
export function buildStockMovementPoints(
  movements: StockMovement[],
  range: TimeRange,
  category: string,
): StockMovementPoint[] {
  const days = rangeToDays(range);
  // Anchor to today (2026-06-05 per project context)
  const today = new Date("2026-06-05T23:59:59Z");

  const points: StockMovementPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(today);
    dayStart.setUTCDate(today.getUTCDate() - i);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const dayMovements = movements.filter((m) => {
      const t = new Date(m.dateTime).getTime();
      const inRange = t >= dayStart.getTime() && t <= dayEnd.getTime();
      const matchCat = !category || m.category === category;
      return inRange && matchCat;
    });

    const stockIn = dayMovements
      .filter(
        (m) => m.movementType === "Stock In" || m.movementType === "Return",
      )
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    const stockOut = dayMovements
      .filter(
        (m) => m.movementType === "Stock Out" || m.movementType === "Damaged",
      )
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    points.push({ date: formatDateLabel(dayStart), stockIn, stockOut });
  }

  return points;
}

/**
 * Builds total units moved per product for the bar chart (top 6 by activity).
 * Accepts optional category filter ("" = all).
 */
export function buildProductMovementRanks(
  movements: StockMovement[],
  range: TimeRange,
  category: string,
): ProductMovementRank[] {
  const days = rangeToDays(range);
  const today = new Date("2026-06-05T23:59:59Z");
  const cutoff = new Date(today);
  cutoff.setUTCDate(today.getUTCDate() - days);

  const totals: Record<string, ProductMovementRank> = {};

  for (const m of movements) {
    const inRange = new Date(m.dateTime).getTime() >= cutoff.getTime();
    const matchCat = !category || m.category === category;
    if (!inRange || !matchCat) continue;

    const key = m.productName;
    if (!totals[key]) {
      totals[key] = {
        productName: m.productName,
        // Shorten to first two words for bar label
        shortName: m.productName.split(" ").slice(0, 3).join(" "),
        category: m.category,
        totalMoved: 0,
      };
    }
    totals[key].totalMoved += Math.abs(m.quantity);
  }

  return Object.values(totals)
    .sort((a, b) => b.totalMoved - a.totalMoved)
    .slice(0, 6);
}

/**
 * Returns the fastest and slowest moving products over the current month.
 */
export function buildInsightProducts(
  movements: StockMovement[],
  products: InventoryProduct[],
): { fastest: InsightProduct; slowest: InsightProduct } {
  const cutoff = new Date("2026-06-01T00:00:00Z");

  const totals: Record<string, number> = {};
  for (const m of movements) {
    if (new Date(m.dateTime) < cutoff) continue;
    totals[m.productName] = (totals[m.productName] ?? 0) + Math.abs(m.quantity);
  }

  let fastest: InsightProduct = { productName: "", brand: "", unitsMoved: 0 };
  let slowest: InsightProduct = {
    productName: "",
    brand: "",
    unitsMoved: Infinity,
  };

  for (const p of products) {
    const moved = totals[p.productName] ?? 0;
    const entry: InsightProduct = {
      productName: p.productName,
      brand: p.brand,
      unitsMoved: moved,
    };
    if (moved > fastest.unitsMoved) fastest = entry;
    if (moved < slowest.unitsMoved) slowest = entry;
  }

  // Edge case: if no movements at all
  if (slowest.unitsMoved === Infinity) {
    slowest = { ...fastest, unitsMoved: 0 };
  }

  return { fastest, slowest };
}
