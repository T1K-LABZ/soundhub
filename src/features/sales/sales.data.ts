import type { Job, SalesFilters, SalesSummary } from "./sales.types";

// ── Computed helpers ──────────────────────────────────────────────────────────

export function calcSalesSummary(jobs: Job[]): SalesSummary {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalSalesMonth = 0;
  let paidCount = 0;
  let paidValue = 0;
  let unpaidCount = 0;
  let unpaidValue = 0;
  let depositCount = 0;
  let depositBalance = 0;
  let completedToday = 0;

  for (const job of jobs) {
    const jobDate = new Date(job.createdAt);

    if (jobDate >= monthStart) {
      totalSalesMonth += job.grandTotal;
    }

    if (job.paymentStatus === "Paid") {
      paidCount++;
      paidValue += job.grandTotal;
    } else if (job.paymentStatus === "Unpaid") {
      unpaidCount++;
      unpaidValue += job.grandTotal;
    } else if (job.paymentStatus === "Deposit Made") {
      depositCount++;
      depositBalance += job.balanceRemaining ?? 0;
    }

    const isToday =
      jobDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
    if (isToday && job.jobStatus === "Completed") {
      completedToday++;
    }
  }

  return {
    totalSalesMonth,
    paidCount,
    paidValue,
    unpaidCount,
    unpaidValue,
    depositCount,
    depositBalance,
    completedToday,
  };
}

export function filterJobs(jobs: Job[], filters: SalesFilters): Job[] {
  return jobs.filter((job) => {
    const q = filters.search.toLowerCase();
    if (
      q &&
      !job.customerName.toLowerCase().includes(q) &&
      !job.carPlate.toLowerCase().includes(q) &&
      !job.jobRef.toLowerCase().includes(q)
    ) {
      return false;
    }

    if (
      filters.paymentStatus !== "All" &&
      filters.paymentStatus !== "" &&
      job.paymentStatus !== filters.paymentStatus
    ) {
      return false;
    }

    if (
      filters.serviceType !== "All" &&
      filters.serviceType !== "" &&
      job.serviceType !== filters.serviceType
    ) {
      return false;
    }

    if (
      filters.jobStatus !== "All" &&
      filters.jobStatus !== "" &&
      job.jobStatus !== filters.jobStatus
    ) {
      return false;
    }

    if (
      filters.carMake !== "All Makes" &&
      filters.carMake !== "All" &&
      filters.carMake !== "" &&
      job.carMake !== filters.carMake
    ) {
      return false;
    }

    if (
      filters.technician !== "All" &&
      filters.technician !== "" &&
      job.technicianName !== filters.technician
    ) {
      return false;
    }

    if (filters.dateFrom) {
      if (new Date(job.createdAt) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(job.createdAt) > new Date(filters.dateTo + "T23:59:59Z"))
        return false;
    }

    return true;
  });
}
