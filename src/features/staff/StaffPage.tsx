import { AddOutlined, SettingsOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { AddStaffModal } from "./AddStaffModal";
import { LeaveModal } from "./LeaveModal";
import { ManageRolesModal } from "./ManageRolesModal";
import { StaffFiltersBar } from "./StaffFiltersBar";
import { StaffGrid } from "./StaffGrid";
import { StaffPerformanceSection } from "./StaffPerformanceSection";
import { StaffSummaryBar } from "./StaffSummaryBar";
import { StaffTable } from "./StaffTable";
import { ViewProfileModal } from "./ViewProfileModal";
import { STAFF_MEMBERS, STAFF_PERFORMANCES } from "./staff.data";
import type { AddStaffForm, StaffFilters, StaffMember } from "./staff.types";
import { calcStaffSummary, filterStaff } from "./staff.utils";

const DEFAULT_FILTERS: StaffFilters = {
  search: "",
  role: "All",
  status: "All",
  employmentType: "All",
  specialization: "All",
};

export function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [filters, setFilters] = useState<StaffFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<"grid" | "table">("grid");

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [viewTarget, setViewTarget] = useState<StaffMember | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<StaffMember | null>(null);
  const [rolesOpen, setRolesOpen] = useState(false);

  const filtered = filterStaff(staff, filters);
  const summary = calcStaffSummary(staff, STAFF_PERFORMANCES);

  function handleSave(form: AddStaffForm) {
    if (editTarget) {
      // Edit existing
      setStaff((prev) =>
        prev.map((s) => (s.id === editTarget.id ? { ...s, ...form } : s)),
      );
    } else {
      // Add new
      const newMember: StaffMember = {
        id: `st-${Date.now()}`,
        ...form,
      };
      setStaff((prev) => [...prev, newMember]);
    }
    setEditTarget(null);
  }

  function handleDeactivate(s: StaffMember) {
    setStaff((prev) =>
      prev.map((m) => (m.id === s.id ? { ...m, status: "Inactive" } : m)),
    );
  }

  function handleMarkLeave(
    staffId: string,
    leave: {
      leaveType: "Annual" | "Sick" | "Emergency" | "Unpaid";
      leaveStart: string;
      leaveEnd: string;
      leaveNotes: string;
    },
  ) {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId ? { ...s, status: "On Leave", ...leave } : s,
      ),
    );
  }

  return (
    <Box>
      <PageHeader
        title="Staff Management"
        subtitle="Manage your team, track performance and control system access"
        action={
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<SettingsOutlined />}
              onClick={() => setRolesOpen(true)}
            >
              Manage Roles
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => {
                setEditTarget(null);
                setAddOpen(true);
              }}
            >
              Add New Staff
            </Button>
          </Box>
        }
      />

      <StaffSummaryBar {...summary} />

      <StaffFiltersBar
        filters={filters}
        view={view}
        onChange={setFilters}
        onViewChange={setView}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      {view === "grid" ? (
        <StaffGrid
          staff={filtered}
          performances={STAFF_PERFORMANCES}
          onView={setViewTarget}
          onEdit={(s) => {
            setEditTarget(s);
            setAddOpen(true);
          }}
          onMarkLeave={setLeaveTarget}
          onDeactivate={handleDeactivate}
        />
      ) : (
        <StaffTable
          staff={filtered}
          performances={STAFF_PERFORMANCES}
          onView={setViewTarget}
          onEdit={(s) => {
            setEditTarget(s);
            setAddOpen(true);
          }}
        />
      )}

      <StaffPerformanceSection
        staff={staff}
        performances={STAFF_PERFORMANCES}
      />

      {/* Modals */}
      <AddStaffModal
        open={addOpen}
        editing={editTarget}
        onClose={() => {
          setAddOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
      />

      <ViewProfileModal
        open={viewTarget !== null}
        staff={viewTarget}
        performance={STAFF_PERFORMANCES.find(
          (p) => p.staffId === viewTarget?.id,
        )}
        onClose={() => setViewTarget(null)}
      />

      <LeaveModal
        open={leaveTarget !== null}
        staff={leaveTarget}
        onClose={() => setLeaveTarget(null)}
        onSave={handleMarkLeave}
      />

      <ManageRolesModal open={rolesOpen} onClose={() => setRolesOpen(false)} />
    </Box>
  );
}
