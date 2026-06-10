import type {
  EmploymentType,
  PagePermissions,
  PermissionLevel,
  Specialization,
  StaffRole,
  StaffStatus,
} from "./staff.types";

// ── Color maps ────────────────────────────────────────────────────────────────

export const ROLE_COLOR: Record<StaffRole, string> = {
  Owner: "#9333EA",
  Manager: "#2563EB",
  "Senior Technician": "#D97706",
  "Junior Technician": "#16A34A",
  "Sales Staff": "#DB2777",
};

export const STATUS_COLOR: Record<StaffStatus, string> = {
  Active: "#16A34A",
  Inactive: "#64748B",
  "On Leave": "#D97706",
  Terminated: "#DC2626",
};

// ── Dropdown options ──────────────────────────────────────────────────────────

export const STAFF_ROLES: StaffRole[] = [
  "Owner",
  "Manager",
  "Senior Technician",
  "Junior Technician",
  "Sales Staff",
];

export const STAFF_STATUSES: StaffStatus[] = [
  "Active",
  "Inactive",
  "On Leave",
  "Terminated",
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full Time",
  "Part Time",
  "Contract",
];

export const SPECIALIZATIONS: Specialization[] = [
  "Installation",
  "Sales",
  "Diagnostics",
  "Customer Service",
  "All-round",
];

export const FILTER_ROLES = ["All", ...STAFF_ROLES];
export const FILTER_STATUSES = ["All", ...STAFF_STATUSES];
export const FILTER_EMPLOYMENT_TYPES = ["All", ...EMPLOYMENT_TYPES];
export const FILTER_SPECIALIZATIONS = ["All", ...SPECIALIZATIONS];

// ── Default permissions per role ──────────────────────────────────────────────

const ALL_ACCESS: PagePermissions = {
  dashboard: "view",
  products: "delete",
  inventory: "delete",
  sales: "delete",
  reports: "view",
  staff: "delete",
  settings: "edit",
};

const MANAGER_ACCESS: PagePermissions = {
  dashboard: "view",
  products: "edit",
  inventory: "edit",
  sales: "edit",
  reports: "view",
  staff: "edit",
  settings: "view",
};

const SENIOR_TECH_ACCESS: PagePermissions = {
  dashboard: "view",
  products: "view",
  inventory: "edit",
  sales: "edit",
  reports: "none",
  staff: "none",
  settings: "none",
};

const JUNIOR_TECH_ACCESS: PagePermissions = {
  dashboard: "view",
  products: "view",
  inventory: "view",
  sales: "add",
  reports: "none",
  staff: "none",
  settings: "none",
};

const SALES_ACCESS: PagePermissions = {
  dashboard: "view",
  products: "view",
  inventory: "none",
  sales: "edit",
  reports: "view",
  staff: "none",
  settings: "none",
};

export const DEFAULT_PERMISSIONS: Record<StaffRole, PagePermissions> = {
  Owner: ALL_ACCESS,
  Manager: MANAGER_ACCESS,
  "Senior Technician": SENIOR_TECH_ACCESS,
  "Junior Technician": JUNIOR_TECH_ACCESS,
  "Sales Staff": SALES_ACCESS,
};

// Ordered levels for the permissions matrix UI
export const PERMISSION_LEVELS: PermissionLevel[] = [
  "none",
  "view",
  "add",
  "edit",
  "delete",
];

export const PERMISSION_PAGES = [
  "dashboard",
  "products",
  "inventory",
  "sales",
  "reports",
  "staff",
  "settings",
] as const;

export const STAFF_ROWS_PER_PAGE = 10;

// Month labels for charts (last 6)
export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
