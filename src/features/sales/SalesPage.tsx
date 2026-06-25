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
import { calcSalesSummary, filterJobs, JOBS } from "./sales.data";
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
  const [filters, setFilters] = useState<SalesFilters>(DEFAULT_SALES_FILTERS);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  const summary = calcSalesSummary(JOBS);
  const filtered = filterJobs(JOBS, filters);

  function handleView(job: Job) {
    setSelectedJob(job);
    setOpenModal("viewJob");
  }

  function handleEdit(job: Job) {
    // TODO: wire up an EditJobModal or re-use NewSaleModal in edit mode
    setSelectedJob(job);
    setOpenModal("newSale");
  }

  function handlePrint(job: Job) {
    setSelectedJob(job);
    window.print();
  }

  return (
    <Box>
      <PageHeader
        title="Sales & Jobs"
        subtitle="Manage all customer jobs, installations, and payments"
      />

      {/* 1. Summary bar */}
      <SalesSummaryBar summary={summary} />

      {/* 2. Quick action buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3, alignItems: "center" }}>
        <Button
          variant="contained"
          color="warning"
          startIcon={<AddOutlined />}
          onClick={() => setOpenModal("newSale")}
        >
          New Sale / Job
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShoppingBagOutlined />}
          onClick={() => setOpenModal("walkIn")}
        >
          Walk-In
        </Button>
        <IconButton
          onClick={(e) => setMoreAnchor(e.currentTarget)}
          size="small"
        >
          <MoreVertOutlined />
        </IconButton>
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
      </Box>

      {/* 3. Filters bar */}
      <SalesFiltersBar filters={filters} onChange={setFilters} />

      {/* 4. Jobs table */}
      <SalesTable
        jobs={filtered}
        onView={handleView}
        onEdit={handleEdit}
        onPrint={handlePrint}
      />

      {/* 5. Knowledge base */}
      <KnowledgeBasePanel />

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <NewSaleModal
        open={openModal === "newSale"}
        onClose={() => {
          setOpenModal(null);
          setSelectedJob(null);
        }}
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
          setSelectedJob(null);
        }}
      />
    </Box>
  );
}
