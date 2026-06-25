import {
  AddOutlined,
  CampaignOutlined,
  DownloadOutlined,
  MoreVertOutlined,
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
import { AddCustomerModal } from "./AddCustomerModal";
import { BirthdayPanel } from "./BirthdayPanel";
import { CustomerCharts } from "./CustomerCharts";
import { CustomerFiltersBar } from "./CustomerFiltersBar";
import { CustomerGrid } from "./CustomerGrid";
import { CustomerProfileModal } from "./CustomerProfileModal";
import { CustomerSummaryBar } from "./CustomerSummaryBar";
import { CustomerTable } from "./CustomerTable";
import { InactiveCustomersPanel } from "./InactiveCustomersPanel";
import { SendOfferModal } from "./SendOfferModal";
import { CUSTOMERS } from "./customers.data";
import type {
  AddCustomerForm,
  Customer,
  CustomerFilters,
} from "./customers.types";
import { calcCustomerSummary, filterCustomers } from "./customers.utils";

const DEFAULT_FILTERS: CustomerFilters = {
  search: "",
  tier: "All",
  location: "All",
  lastVisit: "Any Time",
  carMake: "All",
  sortBy: "Most Recent",
};

// Static growth data for charts (last 6 months)
const TOTAL_BY_MONTH = [6, 7, 8, 9, 11, 12];
const NEW_BY_MONTH = [2, 1, 1, 1, 2, 1];

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [filters, setFilters] = useState<CustomerFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [viewTarget, setViewTarget] = useState<Customer | null>(null);
  const [offerTarget, setOfferTarget] = useState<Customer | null>(null);
  const [bulkOfferOpen, setBulkOfferOpen] = useState(false);

  const filtered = filterCustomers(customers, filters);
  const summary = calcCustomerSummary(customers);

  function handleSave(form: AddCustomerForm) {
    if (editTarget) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? {
                ...c,
                ...form,
                vehicles: form.vehicles.map((v) => ({ ...v, id: v.localId })),
              }
            : c,
        ),
      );
    } else {
      const newCustomer: Customer = {
        id: `c-${Date.now()}`,
        ...form,
        vehicles: form.vehicles.map((v) => ({ ...v, id: v.localId })),
        memberSince: new Date().toISOString().split("T")[0],
        totalVisits: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        totalSpent: 0,
        loyaltyPoints: 0,
        offersHistory: [],
        customerNotes: [],
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setEditTarget(null);
  }

  return (
    <Box>
      <PageHeader
        title="Customer Management"
        subtitle="Track customers, loyalty and send offers"
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddOutlined />}
              onClick={() => {
                setEditTarget(null);
                setAddOpen(true);
              }}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add Customer
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
              <MenuItem onClick={() => { setBulkOfferOpen(true); setMoreAnchor(null); }}>
                <ListItemIcon><CampaignOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Send Campaign</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>
                <ListItemIcon><DownloadOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Export List</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />

      <CustomerSummaryBar summary={summary} />

      <CustomerCharts
        summary={summary}
        totalByMonth={TOTAL_BY_MONTH}
        newByMonth={NEW_BY_MONTH}
      />

      <CustomerFiltersBar
        filters={filters}
        view={view}
        onChange={setFilters}
        onViewChange={setView}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      {view === "grid" ? (
        <CustomerGrid
          customers={filtered}
          onView={setViewTarget}
          onSendOffer={setOfferTarget}
          onEdit={(c) => {
            setEditTarget(c);
            setAddOpen(true);
          }}
        />
      ) : (
        <CustomerTable
          customers={filtered}
          onView={setViewTarget}
          onSendOffer={setOfferTarget}
          onEdit={(c) => {
            setEditTarget(c);
            setAddOpen(true);
          }}
        />
      )}

      <BirthdayPanel customers={customers} onSendOffer={setOfferTarget} />

      <InactiveCustomersPanel
        customers={customers}
        onSendOffer={setOfferTarget}
        onBulkWinback={() => setBulkOfferOpen(true)}
      />

      {/* Modals */}
      <AddCustomerModal
        open={addOpen}
        editing={editTarget}
        onClose={() => {
          setAddOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
      />

      <CustomerProfileModal
        open={viewTarget !== null}
        customer={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      <SendOfferModal
        open={offerTarget !== null || bulkOfferOpen}
        customer={offerTarget}
        onClose={() => {
          setOfferTarget(null);
          setBulkOfferOpen(false);
        }}
      />
    </Box>
  );
}
