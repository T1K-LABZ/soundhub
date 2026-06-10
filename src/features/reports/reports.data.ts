import type { Job } from "../sales/sales.types";
import type { InventoryProduct } from "../inventory/inventory.types";
import {
  PAYMENT_STATUS_COLOR,
  SERVICE_TYPE_COLOR,
} from "../sales/sales.constants";
import type {
  FaultRecord,
  OutstandingPayment,
  PaymentBreakdown,
  ProductStat,
  ReportPeriod,
  RevenuePoint,
  TechnicianStat,
  CarStat,
} from "./reports.types";
import { filterJobsByPeriod } from "./reports.utils";

// ── Fault Records ─────────────────────────────────────────────────────────────

export const FAULT_RECORDS: FaultRecord[] = [
  {
    id: "f1",
    date: "2026-06-10",
    productName: 'Alpine X-Series 12" Subwoofer',
    brand: "Alpine",
    serial: "ALP-X12-SW",
    quantity: 1,
    faultDescription:
      "Cone damage — surround torn during installation stress test",
    actionTaken: "Written Off",
    valueLost: 18500,
    loggedBy: "Brian",
  },
  {
    id: "f2",
    date: "2026-05-18",
    productName: "Pioneer AVH-Z9250BT Double DIN",
    brand: "Pioneer",
    serial: "PIO-AVH-Z9250",
    quantity: 1,
    faultDescription:
      "Display cracked — unit dropped during warehouse handling",
    actionTaken: "Return to Supplier",
    valueLost: 32000,
    loggedBy: "James",
  },
  {
    id: "f3",
    date: "2026-05-08",
    productName: "Sony XS-FB6930 6x9 Speakers",
    brand: "Sony",
    serial: "SNY-FB6930",
    quantity: 2,
    faultDescription:
      "Cone punctured — warehouse mishandling with sharp object",
    actionTaken: "Written Off",
    valueLost: 5500,
    loggedBy: "Mercy",
  },
  {
    id: "f4",
    date: "2026-04-22",
    productName: "JL Audio 4-Channel Amplifier XD400/4",
    brand: "JL Audio",
    serial: "JLA-XD400-4",
    quantity: 1,
    faultDescription:
      "Blown internal fuse — unit received with pre-existing fault",
    actionTaken: "Sent for Repair",
    valueLost: 28000,
    loggedBy: "Kevin",
  },
  {
    id: "f5",
    date: "2026-04-11",
    productName: 'Kenwood KFC-E174 6.5" Tweeters',
    brand: "Kenwood",
    serial: "KNW-KFC-E174",
    quantity: 3,
    faultDescription: "Surround material worn — batch defect from supplier",
    actionTaken: "Warranty Replacement",
    valueLost: 2800,
    loggedBy: "James",
  },
];

// ── Revenue Points (90 days: April 1 – June 29, 2026) ────────────────────────

function makeRevenuePoint(dateStr: string, isWeekend: boolean): RevenuePoint {
  const base = isWeekend
    ? Math.floor(Math.random() * 20000 + 25000) // 25k–45k on weekends
    : Math.floor(Math.random() * 20000 + 5000); // 5k–25k on weekdays
  const rate = 0.6 + Math.random() * 0.3; // 60–90% collected
  const collected = Math.floor(base * rate);
  return {
    date: dateStr,
    total: base,
    collected,
    outstanding: base - collected,
  };
}

function buildStaticRevenuePoints(): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  const start = new Date("2026-04-01T00:00:00Z");
  for (let i = 0; i < 90; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const dayOfWeek = d.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const label = d.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    points.push(makeRevenuePoint(label, isWeekend));
  }
  return points;
}

export const REVENUE_POINTS: RevenuePoint[] = buildStaticRevenuePoints();

// ── Builder helpers ───────────────────────────────────────────────────────────

export function buildRevenuePoints(
  jobs: Job[],
  period: ReportPeriod,
): RevenuePoint[] {
  const filtered = filterJobsByPeriod(jobs, period);

  // Group by date
  const byDate: Record<string, { total: number; collected: number }> = {};
  for (const job of filtered) {
    const d = job.createdAt.slice(0, 10);
    if (!byDate[d]) byDate[d] = { total: 0, collected: 0 };
    byDate[d].total += job.grandTotal;

    const paid =
      job.paymentStatus === "Paid" ? job.grandTotal : (job.depositAmount ?? 0);
    byDate[d].collected += paid;
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      total: v.total,
      collected: v.collected,
      outstanding: v.total - v.collected,
    }));
}

export function buildPaymentBreakdown(jobs: Job[]): PaymentBreakdown[] {
  const map: Record<string, { count: number; value: number }> = {};
  for (const job of jobs) {
    if (!map[job.paymentStatus])
      map[job.paymentStatus] = { count: 0, value: 0 };
    map[job.paymentStatus].count += 1;
    map[job.paymentStatus].value += job.grandTotal;
  }
  return Object.entries(map).map(([status, v]) => ({
    status,
    count: v.count,
    value: v.value,
    color:
      PAYMENT_STATUS_COLOR[status as keyof typeof PAYMENT_STATUS_COLOR] ??
      "#94a3b8",
  }));
}

export function buildTechnicianStats(jobs: Job[]): TechnicianStat[] {
  const map: Record<
    string,
    { jobs: Job[]; revenue: number; followUps: number }
  > = {};

  for (const job of jobs) {
    const name = job.technicianName;
    if (!map[name]) map[name] = { jobs: [], revenue: 0, followUps: 0 };
    map[name].jobs.push(job);
    map[name].revenue += job.grandTotal;
    if (job.followUpNeeded) map[name].followUps += 1;
  }

  return Object.entries(map).map(([name, v]) => {
    const completed = v.jobs.filter((j) => j.jobStatus === "Completed").length;
    const serviceCounts: Record<string, number> = {};
    for (const j of v.jobs) {
      serviceCounts[j.serviceType] = (serviceCounts[j.serviceType] ?? 0) + 1;
    }
    const topService =
      Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return {
      name,
      jobsCompleted: completed,
      revenue: v.revenue,
      avgJobValue:
        v.jobs.length > 0 ? Math.round(v.revenue / v.jobs.length) : 0,
      followUpRate:
        v.jobs.length > 0 ? Math.round((v.followUps / v.jobs.length) * 100) : 0,
      topService,
    };
  });
}

export function buildProductStats(
  jobs: Job[],
  products: InventoryProduct[],
): ProductStat[] {
  const sold: Record<string, { units: number; revenue: number }> = {};

  for (const job of jobs) {
    for (const p of job.products) {
      if (!sold[p.productId]) sold[p.productId] = { units: 0, revenue: 0 };
      sold[p.productId].units += p.quantity;
      sold[p.productId].revenue += p.lineTotal;
    }
  }

  return products
    .map((p, idx) => {
      const s = sold[p.productId] ?? { units: 0, revenue: 0 };
      return {
        rank: idx + 1,
        productName: p.productName,
        brand: p.brand,
        category: p.category,
        unitsSold: s.units,
        revenue: s.revenue,
        avgPrice:
          s.units > 0 ? Math.round(s.revenue / s.units) : p.sellingPrice,
        stockLeft: p.quantityOnHand,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

export function buildCarStats(jobs: Job[]): CarStat[] {
  const map: Record<
    string,
    {
      carMake: string;
      carModel: string;
      carVariant: string;
      jobs: Job[];
      issues: number;
      services: Record<string, number>;
      spend: number;
    }
  > = {};

  for (const job of jobs) {
    const key = `${job.carMake}|${job.carModel}|${job.carVariant}`;
    if (!map[key]) {
      map[key] = {
        carMake: job.carMake,
        carModel: job.carModel,
        carVariant: job.carVariant,
        jobs: [],
        issues: 0,
        services: {},
        spend: 0,
      };
    }
    map[key].jobs.push(job);
    map[key].spend += job.grandTotal;
    if (job.issuesEncountered) map[key].issues += 1;
    map[key].services[job.serviceType] =
      (map[key].services[job.serviceType] ?? 0) + 1;
  }

  return Object.values(map)
    .map((v, i) => {
      const topSvc =
        Object.entries(v.services).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      return {
        rank: i + 1,
        carMake: v.carMake,
        carModel: v.carModel,
        carVariant: v.carVariant,
        jobsCount: v.jobs.length,
        mostCommonService: topSvc,
        avgSpend: v.jobs.length > 0 ? Math.round(v.spend / v.jobs.length) : 0,
        issuesCount: v.issues,
      };
    })
    .sort((a, b) => b.jobsCount - a.jobsCount)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

export function buildOutstandingPayments(jobs: Job[]): OutstandingPayment[] {
  const TODAY = new Date("2026-06-05");
  return jobs
    .filter((j) => j.paymentStatus !== "Paid" && j.grandTotal > 0)
    .map((j) => {
      const amountPaid = j.depositAmount ?? 0;
      const balanceOwed =
        j.paymentStatus === "Unpaid"
          ? j.grandTotal
          : (j.balanceRemaining ?? j.grandTotal - amountPaid);
      const jobDate = new Date(j.createdAt);
      const daysOutstanding = Math.floor(
        (TODAY.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        id: j.id,
        customerName: j.customerName,
        customerPhone: j.customerPhone,
        carPlate: j.carPlate,
        jobRef: j.jobRef,
        date: j.createdAt.slice(0, 10),
        grandTotal: j.grandTotal,
        amountPaid,
        balanceOwed,
        daysOutstanding: Math.max(0, daysOutstanding),
      };
    });
}

export function calcKpis(
  jobs: Job[],
  products: InventoryProduct[],
  faults: FaultRecord[],
) {
  const totalRevenue = jobs.reduce((s, j) => s + j.grandTotal, 0);
  const jobsCompleted = jobs.filter((j) => j.jobStatus === "Completed").length;
  const avgJobValue =
    jobs.length > 0 ? Math.round(totalRevenue / jobs.length) : 0;

  const outstanding = jobs
    .filter((j) => j.paymentStatus !== "Paid")
    .reduce(
      (s, j) =>
        s +
        (j.balanceRemaining ??
          (j.paymentStatus === "Unpaid" ? j.grandTotal : 0)),
      0,
    );

  const totalStockValue = products.reduce(
    (s, p) => s + p.buyingPrice * p.quantityOnHand,
    0,
  );

  const unitsSold = jobs.reduce(
    (s, j) => s + j.products.reduce((ps, p) => ps + p.quantity, 0),
    0,
  );

  const faultValue = faults.reduce((s, f) => s + f.valueLost, 0);

  // Top technician by revenue
  const techRevenue: Record<string, number> = {};
  for (const j of jobs) {
    techRevenue[j.technicianName] =
      (techRevenue[j.technicianName] ?? 0) + j.grandTotal;
  }
  const topTech =
    Object.entries(techRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    totalRevenue,
    jobsCompleted,
    avgJobValue,
    outstanding,
    totalStockValue,
    unitsSold,
    faultValue,
    topTech,
  };
}

// Re-export SERVICE_TYPE_COLOR so chart components can use it via reports.data
export { SERVICE_TYPE_COLOR };
