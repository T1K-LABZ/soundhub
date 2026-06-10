import type { StaffMember, StaffPerformance } from "./staff.types";

/** Returns uppercase initials from a full name — e.g. "Brian Kamau" → "BK" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Human-readable tenure — e.g. "2 years 3 months" */
export function getTenure(dateJoined: string): string {
  const joined = new Date(dateJoined);
  const now = new Date();
  let years = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth() - joined.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  return parts.length ? parts.join(" ") : "Just joined";
}

/** Short date label — e.g. "Jan 2022" */
export function formatJoinDate(dateJoined: string): string {
  return new Date(dateJoined).toLocaleDateString("en-KE", {
    month: "short",
    year: "numeric",
  });
}

/** Format KES amount */
export function formatKsh(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

/** Filters the staff list based on the active filter state */
export function filterStaff(
  staff: StaffMember[],
  filters: {
    search: string;
    role: string;
    status: string;
    employmentType: string;
    specialization: string;
  },
): StaffMember[] {
  return staff.filter((s) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.fullName.toLowerCase().includes(q) && !s.phone.includes(q))
        return false;
    }
    if (filters.role !== "All" && s.role !== filters.role) return false;
    if (filters.status !== "All" && s.status !== filters.status) return false;
    if (
      filters.employmentType !== "All" &&
      s.employmentType !== filters.employmentType
    )
      return false;
    if (
      filters.specialization !== "All" &&
      !s.specializations.includes(filters.specialization as never)
    )
      return false;
    return true;
  });
}

/** Build summary counts from the staff list */
export function calcStaffSummary(
  staff: StaffMember[],
  performances: StaffPerformance[],
) {
  const total = staff.length;
  const active = staff.filter((s) => s.status === "Active").length;
  const onLeave = staff.filter((s) => s.status === "On Leave").length;

  const totalJobsThisMonth = performances.reduce(
    (s, p) => s + p.jobsThisMonth,
    0,
  );

  const top = performances.reduce(
    (best, p) => (p.jobsThisMonth > best.jobsThisMonth ? p : best),
    performances[0],
  );
  const topPerformer = staff.find((s) => s.id === top?.staffId);

  return {
    total,
    active,
    onLeave,
    totalJobsThisMonth,
    topPerformerName: topPerformer?.fullName ?? "—",
    topPerformerJobs: top?.jobsThisMonth ?? 0,
  };
}
