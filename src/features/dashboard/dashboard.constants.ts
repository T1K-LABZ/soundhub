import type { ActivityStatus } from "./dashboard.types";

// UI-only map — will never come from the API
export const ACTIVITY_STATUS_COLOR: Record<
  ActivityStatus,
  "success" | "error" | "warning"
> = {
  Sale: "success",
  Restock: "error",
  "Low Stock": "warning",
};

export const STAT_ICONS: Record<string, string> = {
  "Total Products": "speaker",
  "Items in Stock": "inventory",
  "Today's Sales": "pos",
  "Monthly Revenue": "trending",
};

export function getAvatarInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
