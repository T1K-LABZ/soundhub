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
  fullName: string;
  phone: string;
  email: string;
  nationalId: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Step 2
  role: StaffRole;
  employmentType: EmploymentType;
  specializations: Specialization[];
  dateJoined: string;
  salaryRate: number;
  notes: string;
  status: StaffStatus;
  // Step 3
  username: string;
  tempPassword: string;
  permissions: PagePermissions;
};

// ── Filter type ───────────────────────────────────────────────────────────────

export type StaffFilters = {
  search: string;
  role: string;
  status: string;
  employmentType: string;
  specialization: string;
};
