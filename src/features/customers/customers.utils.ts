import type {
  Customer,
  CustomerFilters,
  CustomerSummary,
  CustomerTier,
} from "./customers.types";
import { deriveCustomerTier } from "./customers.types";

/** Uppercase initials — "John Kamau" → "JK" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Format KES */
export function formatKsh(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

/** Short date — "5 Jun 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Returns true if the customer's birthday month matches the current month */
export function isBirthdayThisMonth(birthday: string | undefined): boolean {
  if (!birthday) return false;
  return new Date(birthday).getMonth() === new Date().getMonth();
}

/** Days since last visit */
export function daysSinceVisit(lastVisit: string): number {
  return Math.floor(
    (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24),
  );
}

/** How many more visits until next tier */
export function visitsToNextTier(c: Customer): string {
  const tier = deriveCustomerTier(c);
  if (tier === "VIP") return "You are VIP";
  if (tier === "Loyal") return `${10 - c.totalVisits} more visits to VIP`;
  if (tier === "Regular") return `${6 - c.totalVisits} more visits to Loyal`;
  return `${2 - c.totalVisits} more visits to Regular`;
}

/** Filter + sort the customer list */
export function filterCustomers(
  customers: Customer[],
  filters: CustomerFilters,
): Customer[] {
  let result = customers.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = c.fullName.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchPlate = c.vehicles.some((v) =>
        v.plate.toLowerCase().includes(q),
      );
      if (!matchName && !matchPhone && !matchPlate) return false;
    }
    if (filters.tier !== "All" && deriveCustomerTier(c) !== filters.tier)
      return false;
    if (filters.location !== "All" && c.location !== filters.location)
      return false;
    if (
      filters.carMake !== "All" &&
      !c.vehicles.some((v) => v.make === filters.carMake)
    )
      return false;

    if (filters.lastVisit && filters.lastVisit !== "Any Time") {
      const days = daysSinceVisit(c.lastVisit);
      if (filters.lastVisit === "This Week" && days > 7) return false;
      if (filters.lastVisit === "This Month" && days > 30) return false;
      if (filters.lastVisit === "Last 3 Months" && days > 90) return false;
      if (filters.lastVisit === "Over 6 Months Ago" && days <= 180)
        return false;
    }
    return true;
  });

  switch (filters.sortBy) {
    case "Most Visits":
      result = result.sort((a, b) => b.totalVisits - a.totalVisits);
      break;
    case "Highest Spend":
      result = result.sort((a, b) => b.totalSpent - a.totalSpent);
      break;
    case "Name A-Z":
      result = result.sort((a, b) => a.fullName.localeCompare(b.fullName));
      break;
    default: // Most Recent
      result = result.sort(
        (a, b) =>
          new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime(),
      );
  }
  return result;
}

/** Build summary counts */
export function calcCustomerSummary(customers: Customer[]): CustomerSummary {
  const tiers = customers.map(deriveCustomerTier);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalVisits = customers.reduce((s, c) => s + c.totalVisits, 0);
  // Retention = customers with 2+ visits / total
  const returning = customers.filter((c) => c.totalVisits >= 2).length;

  // "New this month" — joined within last 30 days
  const now = Date.now();
  const newThisMonth = customers.filter(
    (c) => now - new Date(c.memberSince).getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length;

  return {
    total: customers.length,
    newThisMonth,
    regular: tiers.filter((t) => t === "Regular").length,
    loyal: tiers.filter((t) => t === "Loyal").length,
    vip: tiers.filter((t) => t === "VIP").length,
    totalLifetimeRevenue: totalRevenue,
    avgSpendPerCustomer: customers.length
      ? Math.round(totalRevenue / customers.length)
      : 0,
    avgVisitsPerCustomer: customers.length
      ? Math.round(totalVisits / customers.length)
      : 0,
    retentionRate: customers.length
      ? Math.round((returning / customers.length) * 100)
      : 0,
    pendingOffers: customers.filter((c) =>
      c.offersHistory.some((o) => o.status === "Sent"),
    ).length,
  };
}
