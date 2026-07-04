import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import PrintIcon from "@mui/icons-material/Print";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuthStore } from "../auth/auth.store";
import { useJobsQuery } from "../sales/sales.api";
import {
  INVENTORY_PRODUCTS,
  STOCK_MOVEMENTS,
} from "../inventory/inventory.data";
import {
  FAULT_RECORDS,
  REVENUE_POINTS,
  buildPaymentBreakdown,
  buildTechnicianStats,
  buildProductStats,
  buildOutstandingPayments,
  calcKpis,
} from "./reports.data";
import { PERIOD_OPTIONS, REPORT_TABS } from "./reports.constants";
import { filterJobsByPeriod, formatKsh } from "./reports.utils";
import type { KpiCard, ReportPeriod } from "./reports.types";
import { ReportsKpiCards } from "./ReportsKpiCards";
import { ReportsMainCharts } from "./ReportsMainCharts";
import { ReportsSalesTab } from "./ReportsSalesTab";
import { ReportsInventoryTab } from "./ReportsInventoryTab";
import { ReportsProductsTab } from "./ReportsProductsTab";
import { ReportsFaultsTab } from "./ReportsFaultsTab";
import { ReportsTechniciansTab } from "./ReportsTechniciansTab";
import { ReportsCarsTab } from "./ReportsCarsTab";
import { ReportsOutstandingSection } from "./ReportsOutstandingSection";

function buildKpiCards(
  jobs: ReturnType<typeof filterJobsByPeriod>,
  showComparison: boolean,
): KpiCard[] {
  const raw = calcKpis(jobs, INVENTORY_PRODUCTS, FAULT_RECORDS);

  const changes = showComparison
    ? {
        totalRevenue: 12.4,
        jobsCompleted: 8.2,
        avgJobValue: -3.1,
        outstanding: 5.0,
        totalStockValue: -1.5,
        unitsSold: 22.3,
        faultValue: -40.0,
        topTech: 0,
      }
    : {};

  return [
    {
      label: "Total Revenue",
      value: formatKsh(raw.totalRevenue),
      subValue: `${jobs.length} jobs`,
      change: (changes as Record<string, number>).totalRevenue,
      icon: "💰",
      color: "#f59e0b",
    },
    {
      label: "Jobs Completed",
      value: String(raw.jobsCompleted),
      subValue: `of ${jobs.length} total`,
      change: (changes as Record<string, number>).jobsCompleted,
      icon: "🔧",
      color: "#22c55e",
    },
    {
      label: "Avg Job Value",
      value: formatKsh(raw.avgJobValue),
      change: (changes as Record<string, number>).avgJobValue,
      icon: "📊",
      color: "#3b82f6",
    },
    {
      label: "Outstanding Amount",
      value: formatKsh(raw.outstanding),
      change: (changes as Record<string, number>).outstanding,
      icon: "⚠️",
      color: "#DC2626",
      alert: raw.outstanding > 0,
    },
    {
      label: "Total Stock Value",
      value: formatKsh(raw.totalStockValue),
      subValue: `${INVENTORY_PRODUCTS.length} products`,
      change: (changes as Record<string, number>).totalStockValue,
      icon: "📦",
      color: "#a855f7",
    },
    {
      label: "Units Sold",
      value: String(raw.unitsSold),
      change: (changes as Record<string, number>).unitsSold,
      icon: "🛒",
      color: "#06b6d4",
    },
    {
      label: "Fault / Write-off Value",
      value: formatKsh(raw.faultValue),
      subValue: `${FAULT_RECORDS.length} records`,
      change: (changes as Record<string, number>).faultValue,
      icon: "🚨",
      color: "#DC2626",
    },
    {
      label: "Top Technician",
      value: raw.topTech,
      subValue: "by revenue",
      icon: "🏆",
      color: "#f59e0b",
    },
  ];
}

export function ReportsPage() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: allJobs = [] } = useJobsQuery(storeId);
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const filteredJobs = filterJobsByPeriod(allJobs, period);

  const kpiCards = buildKpiCards(filteredJobs, showComparison);
  const paymentBreakdown = buildPaymentBreakdown(filteredJobs);
  const techStats = buildTechnicianStats(filteredJobs);
  const productStats = buildProductStats(filteredJobs, INVENTORY_PRODUCTS);
  const outstanding = buildOutstandingPayments(allJobs);

  const revenuePoints = REVENUE_POINTS;

  return (
    <Box>
      <PageHeader
        subtitle="Track revenue, inventory, faults, and technician performance"
        action={(
          <IconButton size="small" onClick={(e) => setExportAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        )}
      />

      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
      >
        <MenuItem
          onClick={() => setExportAnchor(null)}
          sx={{ gap: 1, fontSize: 13 }}
        >
          <PictureAsPdfIcon fontSize="small" /> Export PDF
        </MenuItem>
        <MenuItem
          onClick={() => setExportAnchor(null)}
          sx={{ gap: 1, fontSize: 13 }}
        >
          <TableChartIcon fontSize="small" /> Export CSV
        </MenuItem>
        <MenuItem
          onClick={() => setExportAnchor(null)}
          sx={{ gap: 1, fontSize: 13 }}
        >
          <PrintIcon fontSize="small" /> Print
        </MenuItem>
      </Menu>

      {/* Period selector + comparison toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: "wrap" }}>
          {PERIOD_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => setPeriod(opt.value as ReportPeriod)}
              variant={period === opt.value ? "contained" : "outlined"}
              sx={{
                fontWeight: period === opt.value ? 700 : 400,
                fontSize: 12,
              }}
            >
              {opt.label}
            </Button>
          ))}
        </ButtonGroup>

        <FormControlLabel
          control={
            <Switch
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              size="small"
            />
          }
          label="Compare to previous period"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 13 } }}
        />
      </Box>

      {/* KPI Cards */}
      <ReportsKpiCards kpis={kpiCards} showComparison={showComparison} />

      {/* Main Charts */}
      <ReportsMainCharts
        revenuePoints={revenuePoints}
        paymentBreakdown={paymentBreakdown}
      />

      {/* Tab navigation */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
      >
        {REPORT_TABS.map((label) => (
          <Tab
            key={label}
            label={label}
            sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
          />
        ))}
      </Tabs>

      {/* Tab panels */}
      {activeTab === 0 && <ReportsSalesTab jobs={filteredJobs} />}
      {activeTab === 1 && (
        <ReportsInventoryTab
          products={INVENTORY_PRODUCTS}
          movements={STOCK_MOVEMENTS}
        />
      )}
      {activeTab === 2 && <ReportsProductsTab productStats={productStats} />}
      {activeTab === 3 && <ReportsFaultsTab faults={FAULT_RECORDS} />}
      {activeTab === 4 && <ReportsTechniciansTab techStats={techStats} />}
      {activeTab === 5 && <ReportsCarsTab jobs={filteredJobs} />}

      {/* Outstanding payments */}
      <ReportsOutstandingSection outstanding={outstanding} />
    </Box>
  );
}
