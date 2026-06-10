export type ActivityStatus = "Sale" | "Restock" | "Low Stock";

export type ActivityItem = {
  id: number;
  product: string;
  action: ActivityStatus;
  amount: string;
  time: string;
};

export type StatItem = {
  label: string;
  value: string;
  color: string;
};
