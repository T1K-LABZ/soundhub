import type {
  DifficultyRating,
  JobStatus,
  PaymentStatus,
  ServiceDefinition,
  ServiceType,
} from "./sales.types";

// ── Status colour maps ────────────────────────────────────────────────────────

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  Paid: "#16A34A",
  Unpaid: "#DC2626",
  "Deposit Made": "#D97706",
};

export const JOB_STATUS_COLOR: Record<JobStatus, string> = {
  Pending: "#64748B",
  "In Progress": "#2563EB",
  Completed: "#16A34A",
  "Follow Up Needed": "#EA580C",
};

export const SERVICE_TYPE_COLOR: Record<ServiceType, string> = {
  Installation: "#9333EA",
  Correction: "#EA580C",
  "Product Only": "#2563EB",
  Diagnostic: "#0891B2",
  "Warranty Job": "#D97706",
  Upgrade: "#16A34A",
};

export const DIFFICULTY_COLOR: Record<DifficultyRating, string> = {
  Easy: "#16A34A",
  Medium: "#D97706",
  Complex: "#DC2626",
};

// ── Dropdown option arrays ────────────────────────────────────────────────────

export const CAR_MAKES: string[] = [
  "All Makes",
  "Toyota",
  "VW",
  "BMW",
  "Mercedes",
  "Subaru",
  "Nissan",
  "Mazda",
  "Ford",
  "Hyundai",
  "Honda",
];

export const PAYMENT_STATUSES: string[] = [
  "All",
  "Paid",
  "Unpaid",
  "Deposit Made",
];

export const JOB_STATUSES: string[] = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Follow Up Needed",
];

export const SERVICE_TYPES: string[] = [
  "All",
  "Installation",
  "Correction",
  "Product Only",
  "Diagnostic",
  "Warranty Job",
  "Upgrade",
];

export const TECHNICIANS: string[] = [
  "All",
  "Brian",
  "Kevin",
  "James",
  "Mercy",
];

export const SALES_ROWS_PER_PAGE = 10;

// ── Default service catalogue ─────────────────────────────────────────────────

export const DEFAULT_SERVICES: ServiceDefinition[] = [
  {
    id: "srv-1",
    name: "Full System Installation",
    code: "SRV-001",
    description: "Head unit, subwoofer, amp, speakers — full fit-out",
    basePrice: 4000,
    estimatedDuration: "3hrs",
    skillLevel: "Senior",
    active: true,
  },
  {
    id: "srv-2",
    name: "Head Unit Only Install",
    code: "SRV-002",
    description: "Single or double DIN head unit installation",
    basePrice: 1500,
    estimatedDuration: "1hr",
    skillLevel: "Junior",
    active: true,
  },
  {
    id: "srv-3",
    name: "Subwoofer + Amp Install",
    code: "SRV-003",
    description: "Subwoofer box placement, amplifier mounting and wiring",
    basePrice: 2500,
    estimatedDuration: "2hrs",
    skillLevel: "Senior",
    active: true,
  },
  {
    id: "srv-4",
    name: "Correction / Re-wire",
    code: "SRV-004",
    description: "Fix previous installation errors, re-route wiring",
    basePrice: 2000,
    estimatedDuration: "2hrs",
    skillLevel: "Senior",
    active: true,
  },
  {
    id: "srv-5",
    name: "Diagnostic",
    code: "SRV-005",
    description: "Fault-finding and system diagnostic check",
    basePrice: 500,
    estimatedDuration: "30min",
    skillLevel: "Junior",
    active: true,
  },
  {
    id: "srv-6",
    name: "Speaker Swap",
    code: "SRV-006",
    description: "Replace factory speakers with aftermarket units",
    basePrice: 1000,
    estimatedDuration: "1hr",
    skillLevel: "Junior",
    active: true,
  },
  {
    id: "srv-7",
    name: "Product Only / No Install",
    code: "SRV-007",
    description: "Customer purchasing product without installation",
    basePrice: 0,
    estimatedDuration: "—",
    skillLevel: "",
    active: true,
  },
];
