import type {
  InventoryProduct,
  InventorySummary,
  StockMovement,
} from "./inventory.types";

export function calcSummary(
  products: InventoryProduct[],
  movements: StockMovement[],
): InventorySummary {
  const totalCostValue = products.reduce(
    (s, p) => s + p.buyingPrice * p.quantityOnHand,
    0,
  );
  const totalRetailValue = products.reduce(
    (s, p) => s + p.sellingPrice * p.quantityOnHand,
    0,
  );
  const totalProducts = products.filter((p) => p.quantityOnHand > 0).length;
  const lowStockCount = products.filter(
    (p) => p.quantityOnHand > 0 && p.quantityOnHand <= p.reorderPoint,
  ).length;
  const outOfStockCount = products.filter((p) => p.quantityOnHand === 0).length;

  // Most moved = product with highest absolute movement volume this month
  const volumeMap: Record<string, number> = {};
  const thisMonth = new Date().getMonth();
  for (const m of movements) {
    if (new Date(m.dateTime).getMonth() === thisMonth) {
      volumeMap[m.productName] =
        (volumeMap[m.productName] ?? 0) + Math.abs(m.quantity);
    }
  }
  const mostMovedProduct =
    Object.entries(volumeMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    totalCostValue,
    totalRetailValue,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    mostMovedProduct,
  };
}

type MovementFilters = {
  search: string;
  category: string;
  brand: string;
  movementType: string;
  staff: string;
  dateFrom: string;
  dateTo: string;
  // Optional: restrict to specific product names (used by Low/Out-of-stock quick filters)
  productNames?: string[];
};

export function filterMovements(
  movements: StockMovement[],
  f: MovementFilters,
): StockMovement[] {
  return movements.filter((m) => {
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !m.productName.toLowerCase().includes(q) &&
        !m.serial.toLowerCase().includes(q)
      )
        return false;
    }
    if (f.category !== "All Categories" && m.category !== f.category)
      return false;
    if (f.brand !== "All Brands" && m.brand !== f.brand) return false;
    if (f.movementType !== "All Types" && m.movementType !== f.movementType)
      return false;
    if (f.staff !== "All Staff" && m.staff !== f.staff) return false;
    if (f.dateFrom && m.dateTime < f.dateFrom) return false;
    if (f.dateTo && m.dateTime > f.dateTo + "T23:59:59Z") return false;
    if (
      f.productNames &&
      f.productNames.length > 0 &&
      !f.productNames.includes(m.productName)
    )
      return false;
    return true;
  });
}

export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
