import {
  AddOutlined,
  MoreVertOutlined,
  SearchOutlined,
  SettingsOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuthStore } from "../auth/auth.store";
import { useJobsQuery, useSalesStatsQuery } from "./sales.api";
import { filterJobs } from "./sales.data";
import type { SalesFilters } from "./sales.types";
import type { Job } from "./sales.types";
import { DEFAULT_SALES_FILTERS, SalesFiltersBar } from "./SalesFiltersBar";
import { SalesSummaryBar } from "./SalesSummaryBar";
import { SalesTable } from "./SalesTable";
import { KnowledgeBasePanel } from "./KnowledgeBasePanel";
import { ManageServicesModal } from "./ManageServicesModal";
import { NewSaleModal } from "./NewSaleModal";
import { PlateSearchModal } from "./PlateSearchModal";
import { ViewJobModal } from "./ViewJobModal";
import { WalkInModal } from "./WalkInModal";

// ── Modal union type ──────────────────────────────────────────────────────────

type ModalType =
  | "newSale"
  | "walkIn"
  | "plateSearch"
  | "manageServices"
  | "viewJob"
  | null;

// ── SalesPage ─────────────────────────────────────────────────────────────────

export function SalesPage() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const role = useAuthStore((s) => s.user?.role);
  const isOwner = role === "OWNER";
  const { data: allJobs = [] } = useJobsQuery(storeId);
  const { data: stats } = useSalesStatsQuery(storeId);

  const [filters, setFilters] = useState<SalesFilters>(DEFAULT_SALES_FILTERS);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  // Always derive selectedJob from the fresh API list so edits are reflected
  const selectedJob = selectedJobId
    ? allJobs.find((j) => j.id === selectedJobId) ?? null
    : null;

  const filtered = filterJobs(allJobs, filters);
  const openJobs = allJobs.filter((job) => job.jobStatus !== "Completed").length;

  function handleView(job: Job) {
    setSelectedJobId(job.id);
    setOpenModal("viewJob");
  }

  function handleEdit(job: Job) {
    setSelectedJobId(job.id);
    setOpenModal("newSale");
  }

  return (
    <Box sx={{ pb: { xs: 3, md: 4 } }}>
      <Paper
        variant="outlined"
        sx={{
          mb: { xs: 2, md: 3 },
          p: { xs: 1.75, sm: 2.5 },
          overflow: "hidden",
          borderColor: "rgba(31, 41, 51, 0.08)",
          boxShadow: { xs: "0 14px 36px rgba(31, 41, 51, 0.07)", md: "none" },
        }}
      >
        <PageHeader
          subtitle="Manage customer jobs, installations, and payments"
          action={(
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: isOwner ? "1fr 1fr auto" : "1fr", sm: "auto auto auto" },
                gap: 1,
                alignItems: "center",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddOutlined />}
                onClick={() => setOpenModal("newSale")}
                sx={{ minHeight: 42, bgcolor: "#F70000", "&:hover": { bgcolor: "#D60000" } }}
              >
                New Job
              </Button>
              {isOwner && (
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBagOutlined />}
                  onClick={() => setOpenModal("walkIn")}
                  sx={{ minHeight: 42 }}
                >
                  Walk-In
                </Button>
              )}
              {isOwner && (
                <IconButton
                  onClick={(e) => setMoreAnchor(e.currentTarget)}
                  size="small"
                  sx={{
                    width: 42,
                    height: 42,
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "rgba(31, 41, 51, 0.03)",
                  }}
                >
                  <MoreVertOutlined />
                </IconButton>
              )}
            </Box>
          )}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(3, auto)" },
            gap: 1,
            mt: -1,
          }}
        >
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, px: 1.25, py: 1 }}>
            <Typography variant="caption" color="text.secondary">Jobs</Typography>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
              {allJobs.length.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, px: 1.25, py: 1 }}>
            <Typography variant="caption" color="text.secondary">Open</Typography>
            <Typography variant="h6" fontWeight={800} color="primary" sx={{ lineHeight: 1.1 }}>
              {openJobs.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, px: 1.25, py: 1 }}>
            <Typography variant="caption" color="text.secondary">Showing</Typography>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
              {filtered.length.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Summary bar — owners only */}
      {isOwner && stats && <SalesSummaryBar stats={stats} />}

      {isOwner && (
        <Menu
            anchorEl={moreAnchor}
            open={Boolean(moreAnchor)}
            onClose={() => setMoreAnchor(null)}
        >
            <MenuItem onClick={() => { setOpenModal("plateSearch"); setMoreAnchor(null); }}>
              <ListItemIcon><SearchOutlined fontSize="small" /></ListItemIcon>
              <ListItemText>Search by Plate</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { setOpenModal("manageServices"); setMoreAnchor(null); }}>
              <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
              <ListItemText>Manage Services</ListItemText>
            </MenuItem>
        </Menu>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderColor: "rgba(31, 41, 51, 0.08)",
          boxShadow: { xs: "0 10px 30px rgba(31, 41, 51, 0.05)", md: "none" },
        }}
      >
        <SalesFiltersBar filters={filters} onChange={setFilters} />

        <SalesTable
          jobs={filtered}
          onView={handleView}
          onEdit={handleEdit}
        />
      </Paper>

      {/* Knowledge base — owners only */}
      {isOwner && <KnowledgeBasePanel />}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <NewSaleModal
        open={openModal === "newSale"}
        onClose={() => {
          setOpenModal(null);
          setSelectedJobId(null);
        }}
        job={selectedJob}
      />

      <WalkInModal
        open={openModal === "walkIn"}
        onClose={() => setOpenModal(null)}
      />

      <PlateSearchModal
        open={openModal === "plateSearch"}
        onClose={() => setOpenModal(null)}
      />

      <ManageServicesModal
        open={openModal === "manageServices"}
        onClose={() => setOpenModal(null)}
      />

      <ViewJobModal
        open={openModal === "viewJob"}
        job={selectedJob}
        onClose={() => {
          setOpenModal(null);
          setSelectedJobId(null);
        }}
      />
    </Box>
  );
}
