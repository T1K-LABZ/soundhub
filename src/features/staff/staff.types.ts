// ── Union types ───────────────────────────────────────────────────────────────

export type StaffRole =
  | "Owner"
  | "Manager"
  | "Senior Technician"
  | "Junior Technician"
  | "Sales Staff";

export type StaffStatus = "Active" | "Inactive" | "On Leave" | "Terminated";

export type EmploymentType = "Full Time" | "Part Time" | "Contract";

export type Specialization =
  | "Installation"
  | "Sales"
  | "Diagnostics"
  | "Customer Service"
  | "All-round";

// ── Backend response types ────────────────────────────────────────────────────

export type Store = {
  id: string;
  name: string;
  organizationId: string;
  branchCode: string | null;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type UserStore = {
  role: string;
  assignedAt: string;
  store: Store;
};

export type AssignableRole = {
  id: string;
  name: string;
  permissions: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>;
};

// ── Backend role types ───────────────────────────────────────────────────────

export type PermissionModule = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

export type RolePermissions = Record<string, PermissionModule>;

export type BackendRole = {
  id: string;
  storeId: string;
  name: string;
  permissions: RolePermissions;
  createdAt: string;
  updatedAt: string;
};

export type CreateRolePayload = {
  storeId: string;
  name: string;
  permissions: RolePermissions;
};

export type UpdateRolePayload = Partial<Omit<CreateRolePayload, "storeId">>;

export type CreateStaffPayload = {
  storeId: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  customRoleId: string;
  nationalId: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  employmentType: string;
  specializations: string[];
  dateJoined: string;
  salaryRate: number;
  notes: string;
  status: string;
};

// ── Core staff record ─────────────────────────────────────────────────────────

export type StaffMember = {
  id: string;

  // Personal
  fullName: string;
  phone: string;
  email: string;
  nationalId: string;
  dateOfBirth: string; // ISO date
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoUrl?: string;

  // Job info
  role: StaffRole;
  employmentType: EmploymentType;
  specializations: Specialization[];
  dateJoined: string; // ISO date
  salaryRate?: number; // KES, optional
  notes?: string;
  status: StaffStatus;

  // System access
  username: string;

  // Leave info (populated when status === "On Leave")
  leaveType?: "Annual" | "Sick" | "Emergency" | "Unpaid";
  leaveStart?: string;
  leaveEnd?: string;
  leaveNotes?: string;
};

// ── Performance snapshot ──────────────────────────────────────────────────────

export type StaffPerformance = {
  staffId: string;
  jobsThisMonth: number;
  revenueThisMonth: number;
  totalJobsAllTime: number;
  totalRevenueAllTime: number;
  followUpRate: number; // percentage
  avgRating: number; // 1-5
  mostCommonService: string;
  // Monthly breakdown for charts — last 6 months
  monthlyJobs: number[]; // [Jan, Feb, Mar, Apr, May, Jun]
  monthlyRevenue: number[];
};

// ── Permission matrix ─────────────────────────────────────────────────────────

export type PermissionLevel = "none" | "view" | "add" | "edit" | "delete";

export type PagePermissions = {
  dashboard: PermissionLevel;
  products: PermissionLevel;
  inventory: PermissionLevel;
  sales: PermissionLevel;
  reports: PermissionLevel;
  staff: PermissionLevel;
  settings: PermissionLevel;
};

// ── Form types ────────────────────────────────────────────────────────────────

export type AddStaffForm = {
  // Step 1
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Step 2
  role: string;
  customRoleId: string;
  employmentType: EmploymentType;
  specializations: Specialization[];
  dateJoined: string;
  salaryRate: number;
  notes: string;
  status: StaffStatus;
  // Step 3
  password: string;
};

// ── Backend staff response ───────────────────────────────────────────────────

export type BackendStaffUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  isActive: boolean;
};

export type BackendStaffMember = {
  id: string;
  role: string;
  customRole: { id: string; name: string } | null;
  createdAt: string;
  user: BackendStaffUser;
  verificationStatus: "UNVERIFIED" | "VERIFIED";
};

// ── Filter type ───────────────────────────────────────────────────────────────

export type StaffFilters = {
  search: string;
  role: string;
  status: string;
  employmentType: string;
  specialization: string;
};
