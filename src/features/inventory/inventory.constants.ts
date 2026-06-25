import type { MovementType } from "./inventory.types";

export const MOVEMENT_TYPE_COLOR: Record<
  MovementType,
  "success" | "error" | "warning" | "info" | "primary"
> = {
  "Stock In": "success",
  "Stock Out": "error",
  Reserved: "warning",
  Damaged: "error",
  Return: "info",
  Incoming: "warning",
};

// NOTE: Damaged uses orange — we override via sx since MUI has no 'orange' semantic colour
export const MOVEMENT_TYPE_HEX: Record<MovementType, string> = {
  "Stock In": "#16A34A",
  "Stock Out": "#DC2626",
  Reserved: "#D97706",
  Damaged: "#EA580C",
  Return: "#2563EB",
  Incoming: "#F59E0B",
};

export const CATEGORIES = [
  "All Categories",
  "Head Units",
  "Speakers",
  "Subwoofers",
  "Amplifiers",
  "Wiring Kits",
  "Tweeters",
  "Enclosures",
];

export const BRANDS = [
  "All Brands",
  "Alpine",
  "Pioneer",
  "Sony",
  "Kenwood",
  "JL Audio",
];

export const MOVEMENT_TYPES: string[] = [
  "All Types",
  "Stock In",
  "Stock Out",
  "Reserved",
  "Damaged",
  "Return",
  "Incoming",
];

export const STAFF_MEMBERS = [
  "All Staff",
  "James Otieno",
  "Faith Wanjiku",
  "Brian Mwangi",
  "Admin",
];

export const ROWS_PER_PAGE = 10;

// ── Chart constants ───────────────────────────────────────────────────────────

export const TIME_RANGE_OPTIONS = ["7D", "30D", "90D"] as const;

// Color per category — used in the bar chart
export const CATEGORY_COLOR: Record<string, string> = {
  Subwoofers: "#f59e0b",
  Amplifiers: "#3b82f6",
  Speakers: "#22c55e",
  "Head Units": "#a855f7",
  "Wiring Kits": "#94a3b8",
  Tweeters: "#ec4899",
};

// Fallback color for unlisted categories
export const CATEGORY_COLOR_DEFAULT = "#64748b";
