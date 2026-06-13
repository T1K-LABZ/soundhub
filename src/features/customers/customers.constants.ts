import type { CustomerTier } from "./customers.types";

// ── Tier color map ────────────────────────────────────────────────────────────

export const TIER_COLOR: Record<CustomerTier, string> = {
  New: "#94a3b8",
  Regular: "#3b82f6",
  Loyal: "#f59e0b",
  VIP: "#a855f7",
};

// ── Nairobi location areas ────────────────────────────────────────────────────

export const NAIROBI_AREAS = [
  "Westlands",
  "Karen",
  "Kilimani",
  "Thika Road",
  "Mombasa Road",
  "Ngong Road",
  "Eastleigh",
  "South B",
  "South C",
  "Langata",
  "CBD",
  "Other",
];

// ── Car makes ─────────────────────────────────────────────────────────────────

export const CAR_MAKES = [
  "Toyota",
  "VW",
  "BMW",
  "Mercedes",
  "Subaru",
  "Nissan",
  "Mazda",
  "Ford",
  "Hyundai",
  "Honda",
  "Other",
];

// ── Filter option arrays ──────────────────────────────────────────────────────

export const FILTER_TIERS = ["All", "New", "Regular", "Loyal", "VIP"];
export const FILTER_LOCATIONS = ["All", ...NAIROBI_AREAS];
export const FILTER_CAR_MAKES = ["All", ...CAR_MAKES];

export const LAST_VISIT_OPTIONS = [
  "Any Time",
  "This Week",
  "This Month",
  "Last 3 Months",
  "Over 6 Months Ago",
];

export const SORT_OPTIONS = [
  "Most Recent",
  "Most Visits",
  "Highest Spend",
  "Name A-Z",
];

// ── Offer types ───────────────────────────────────────────────────────────────

export const OFFER_TYPES = [
  "Discount %",
  "Fixed Discount",
  "Free Service",
  "Bundle Deal",
  "Birthday Offer",
  "Loyalty Reward",
  "General Promotion",
] as const;

export const OFFER_CHANNELS = ["Whatsapp", "SMS", "Email"] as const;

export const BULK_SEGMENTS = [
  "All Customers",
  "VIP Only",
  "Loyal Customers",
  "Regular Customers",
  "New Customers",
  "Inactive (6+ months)",
  "By Car Make",
  "By Location",
] as const;

export const CUSTOMERS_PER_PAGE = 10;

// Growth chart — last 6 months labels
export const CHART_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Profile modal — same labels reused for per-month visit chart
export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
