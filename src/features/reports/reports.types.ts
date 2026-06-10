export type ReportPeriod =
  | "today"
  | "week"
  | "month"
  | "lastMonth"
  | "year"
  | "custom";

export type KpiCard = {
  label: string;
  value: string;
  subValue?: string;
  change?: number; // % change vs previous period, positive = up
  icon: string; // emoji
  color: string;
  alert?: boolean; // red highlight
};

export type RevenuePoint = {
  date: string;
  total: number;
  collected: number;
  outstanding: number;
};

export type PaymentBreakdown = {
  status: string;
  count: number;
  value: number;
  color: string;
};

export type FaultRecord = {
  id: string;
  date: string;
  productName: string;
  brand: string;
  serial: string;
  quantity: number;
  faultDescription: string;
  actionTaken:
    | "Written Off"
    | "Return to Supplier"
    | "Warranty Replacement"
    | "Sent for Repair";
  valueLost: number;
  loggedBy: string;
};

export type TechnicianStat = {
  name: string;
  jobsCompleted: number;
  revenue: number;
  avgJobValue: number;
  followUpRate: number;
  topService: string;
};

export type ProductStat = {
  rank: number;
  productName: string;
  brand: string;
  category: string;
  unitsSold: number;
  revenue: number;
  avgPrice: number;
  stockLeft: number;
};

export type OutstandingPayment = {
  id: string;
  customerName: string;
  customerPhone: string;
  carPlate: string;
  jobRef: string;
  date: string;
  grandTotal: number;
  amountPaid: number;
  balanceOwed: number;
  daysOutstanding: number;
};

export type CarStat = {
  rank: number;
  carMake: string;
  carModel: string;
  carVariant: string;
  jobsCount: number;
  mostCommonService: string;
  avgSpend: number;
  issuesCount: number;
};
