// ── Primitive union types ─────────────────────────────────────────────────────

export type PaymentStatus = "Paid" | "Unpaid" | "Deposit Made";

export type PaymentMethod = "Cash" | "Mpesa" | "Card" | "Bank Transfer";

export type JobStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Follow Up Needed";

export type ServiceType =
  | "Installation"
  | "Correction"
  | "Product Only"
  | "Diagnostic"
  | "Warranty Job"
  | "Upgrade";

export type DifficultyRating = "Easy" | "Medium" | "Complex";

// ── Service definition ────────────────────────────────────────────────────────

export type ServiceDefinition = {
  id: string;
  name: string;
  code: string; // e.g. "SRV-001"
  description: string;
  basePrice: number;
  estimatedDuration: string; // e.g. "3hrs", "30min"
  skillLevel: "Junior" | "Senior" | "";
  active: boolean;
};

// ── Job sub-types ─────────────────────────────────────────────────────────────

export type JobProduct = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

// ── Core Job record ───────────────────────────────────────────────────────────

export type Job = {
  id: string;
  jobRef: string; // e.g. "JOB-0023"
  createdAt: string; // ISO date string

  // Customer
  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  // Vehicle
  carPlate: string;
  carMake: string;
  carModel: string;
  carVariant: string;
  carYear: number;

  // Work
  serviceType: ServiceType;
  services: ServiceDefinition[];
  products: JobProduct[];

  // Financials
  productsSubtotal: number;
  servicesSubtotal: number;
  discount: number;
  grandTotal: number;

  // Payment
  paymentStatus: PaymentStatus;
  depositAmount?: number;
  balanceRemaining?: number;
  paymentMethod: PaymentMethod;
  mpesaRef?: string;
  paymentDate: string; // ISO date string

  // Technician & status
  technicianName: string;
  jobStatus: JobStatus;

  // Notes
  installationNotes: string;
  issuesEncountered?: string;
  issuesResolution?: string;
  difficultyRating: DifficultyRating;
  followUpNeeded: boolean;
  followUpNotes?: string;
};

// ── Summary & filter types ────────────────────────────────────────────────────

export type SalesSummary = {
  totalSalesMonth: number;
  paidCount: number;
  paidValue: number;
  unpaidCount: number;
  unpaidValue: number;
  depositCount: number;
  depositBalance: number;
  completedToday: number;
};

export type SalesFilters = {
  search: string;
  paymentStatus: string;
  serviceType: string;
  dateFrom: string;
  dateTo: string;
  carMake: string;
  technician: string;
  jobStatus: string;
};

// ── Legacy POS types (kept for backward compatibility) ────────────────────────

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Sale = {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
};
