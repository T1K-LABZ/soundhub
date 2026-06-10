import type { Job } from "../sales/sales.types";
import type { ReportPeriod } from "./reports.types";

// ── Formatting ────────────────────────────────────────────────────────────────

/** Formats a number as Kenyan Shillings: "KES 12,500" */
export function formatKsh(n: number): string {
  return `KES ${n.toLocaleString("en-KE")}`;
}

/** Formats a percentage change: "+12%" or "-5%" */
export function formatPercent(n: number): string {
  if (n >= 0) return `+${n.toFixed(1)}%`;
  return `${n.toFixed(1)}%`;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

/** Anchor date — treat as "today" throughout the project */
const TODAY = new Date("2026-06-05T23:59:59Z");

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(n: number): Date {
  const d = new Date(TODAY);
  d.setUTCDate(TODAY.getUTCDate() - n);
  return startOfDay(d);
}

/** Returns only the jobs that fall within the selected period */
export function filterJobsByPeriod(jobs: Job[], period: ReportPeriod): Job[] {
  const now = TODAY;

  let from: Date;
  let to: Date = new Date(now);

  switch (period) {
    case "today":
      from = startOfDay(now);
      break;
    case "week": {
      // Monday of current week
      const dow = now.getUTCDay(); // 0 = Sun
      const diffToMon = dow === 0 ? 6 : dow - 1;
      from = daysAgo(diffToMon);
      break;
    }
    case "month":
      from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      break;
    case "lastMonth": {
      const y = now.getUTCFullYear();
      const m = now.getUTCMonth(); // current month 0-indexed
      from = new Date(Date.UTC(y, m - 1, 1));
      to = new Date(Date.UTC(y, m, 0, 23, 59, 59)); // last day of prev month
      break;
    }
    case "year":
      from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      break;
    case "custom":
    default:
      // custom: return all (caller should pre-filter)
      return jobs;
  }

  return jobs.filter((j) => {
    const d = new Date(j.createdAt);
    return d >= from && d <= to;
  });
}

/** Human-readable label for the selected period */
export function getPeriodLabel(period: ReportPeriod): string {
  switch (period) {
    case "today":
      return "Today";
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "lastMonth":
      return "Last Month";
    case "year":
      return "This Year";
    case "custom":
      return "Custom Range";
    default:
      return "";
  }
}
