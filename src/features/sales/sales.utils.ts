import type { CartItem, Job } from "./sales.types";

// ── Formatting ────────────────────────────────────────────────────────────────

/** Formats a number as Kenyan shillings, e.g. "KES 24,000" */
export function formatKsh(n: number): string {
  return `KES ${n.toLocaleString("en-KE")}`;
}

/** Formats an ISO date string to a readable label, e.g. "2 Jun 2026, 09:15" */
export function formatJobDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Job helpers ───────────────────────────────────────────────────────────────

/** Returns all jobs matching a given car plate (case-insensitive) */
export function getJobsByPlate(jobs: Job[], plate: string): Job[] {
  const q = plate.trim().toUpperCase();
  return jobs.filter((j) => j.carPlate.toUpperCase() === q);
}

/** Calculates grand total: products + services minus discount */
export function calcGrandTotal(
  productsSubtotal: number,
  servicesSubtotal: number,
  discount: number,
): number {
  return Math.max(0, productsSubtotal + servicesSubtotal - discount);
}

// ── Legacy POS helper (kept for backward compatibility) ───────────────────────

export function calculateCartItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}
