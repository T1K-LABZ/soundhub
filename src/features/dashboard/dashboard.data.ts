import type { ActivityItem, StatItem } from "./dashboard.types";

export const DASHBOARD_STATS: StatItem[] = [
  { label: "Total Products", value: "124", color: "#F70000" },
  { label: "Items in Stock", value: "3,842", color: "#2563EB" },
  { label: "Today's Sales", value: "KSh 1,290", color: "#16A34A" },
  { label: "Monthly Revenue", value: "KSh 24,580", color: "#9333EA" },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    product: "Yamaha HS8 Studio Monitor",
    action: "Sale",
    amount: "-2 units",
    time: "5 min ago",
  },
  {
    id: 2,
    product: "Shure SM7B Microphone",
    action: "Restock",
    amount: "+20 units",
    time: "1 hr ago",
  },
  {
    id: 3,
    product: "Roland TD-17 Drum Kit",
    action: "Low Stock",
    amount: "3 left",
    time: "2 hr ago",
  },
  {
    id: 4,
    product: "Focusrite Scarlett 2i2",
    action: "Sale",
    amount: "-1 unit",
    time: "3 hr ago",
  },
  {
    id: 5,
    product: "Native Instruments Komplete",
    action: "Restock",
    amount: "+10 units",
    time: "5 hr ago",
  },
];
