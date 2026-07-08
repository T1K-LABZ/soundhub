export type MovementType = "SALE" | "RECEIVE" | "ADJUSTMENT";

export const MOVEMENT_STATUS_COLOR: Record<
  MovementType,
  "success" | "error" | "warning"
> = {
  SALE: "success",
  RECEIVE: "error",
  ADJUSTMENT: "warning",
};

export const AVATAR_COLORS: Record<MovementType, string> = {
  SALE: "rgba(22, 163, 74, 0.1)",
  RECEIVE: "rgba(247, 0, 0, 0.06)",
  ADJUSTMENT: "rgba(234, 179, 8, 0.1)",
};

export const AVATAR_TEXT_COLORS: Record<MovementType, string> = {
  SALE: "#16A34A",
  RECEIVE: "#F70000",
  ADJUSTMENT: "#EAB308",
};

export function getMovementLabel(type: MovementType): string {
  switch (type) {
    case "SALE":
      return "Sale";
    case "RECEIVE":
      return "Restock";
    case "ADJUSTMENT":
      return "Low Stock";
    default:
      return type;
  }
}

export function getAvatarInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
