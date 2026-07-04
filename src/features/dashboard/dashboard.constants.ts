import type { ActivityStatus } from "./dashboard.types";

export const ACTIVITY_STATUS_COLOR: Record<
  ActivityStatus,
  "success" | "error" | "warning"
> = {
  Sale: "success",
  Restock: "error",
  "Low Stock": "warning",
};

export const AVATAR_COLORS: Record<ActivityStatus, string> = {
  Sale: "rgba(22, 163, 74, 0.1)",
  Restock: "rgba(247, 0, 0, 0.06)",
  "Low Stock": "rgba(234, 179, 8, 0.1)",
};

export const AVATAR_TEXT_COLORS: Record<ActivityStatus, string> = {
  Sale: "#16A34A",
  Restock: "#F70000",
  "Low Stock": "#EAB308",
};

export function getAvatarInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
