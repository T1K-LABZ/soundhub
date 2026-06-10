export const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "year" },
] as const;

export const REPORT_TABS = [
  "Sales",
  "Inventory",
  "Products",
  "Faults & Losses",
  "Technicians",
  "Cars & Installations",
];

export const CATEGORY_COLOR: Record<string, string> = {
  Subwoofers: "#f59e0b",
  Amplifiers: "#3b82f6",
  Speakers: "#22c55e",
  "Head Units": "#a855f7",
  "Wiring Kits": "#94a3b8",
  Tweeters: "#ec4899",
};

export const ACTION_COLOR: Record<string, string> = {
  "Written Off": "#DC2626",
  "Return to Supplier": "#2563EB",
  "Warranty Replacement": "#16A34A",
  "Sent for Repair": "#D97706",
};

export const DAYS_OUTSTANDING_COLOR = (days: number): string => {
  if (days <= 7) return "#D97706";
  if (days <= 30) return "#EA580C";
  return "#DC2626";
};
