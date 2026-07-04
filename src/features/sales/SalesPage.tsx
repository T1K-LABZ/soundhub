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

  function handleView(job: Job) {
    setSelectedJobId(job.id);
    setOpenModal("viewJob");
  }

  function handleEdit(job: Job) {
    setSelectedJobId(job.id);
    setOpenModal("newSale");
  }

  return (
    <Box>
      <PageHeader
        subtitle="Manage all customer jobs, installations, and payments"
        action={(
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddOutlined />}
              onClick={() => setOpenModal("newSale")}
            >
              New Sale / Job
            </Button>
            {isOwner && (
              <Button
                variant="outlined"
                startIcon={<ShoppingBagOutlined />}
                onClick={() => setOpenModal("walkIn")}
              >
                Walk-In
              </Button>
            )}
            {isOwner && (
              <IconButton
                onClick={(e) => setMoreAnchor(e.currentTarget)}
                size="small"
              >
                <MoreVertOutlined />
              </IconButton>
            )}
          </Box>
        )}
      />

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

      <SalesFiltersBar filters={filters} onChange={setFilters} />

      <SalesTable
        jobs={filtered}
        onView={handleView}
        onEdit={handleEdit}
      />

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
