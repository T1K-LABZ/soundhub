import { AddOutlined, MoreVertOutlined, SettingsOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { PageHeader } from "../../components/ui/PageHeader";
import { AddStaffModal } from "./AddStaffModal";
import { fetchStaff } from "./staff.api";
import { LeaveModal } from "./LeaveModal";
import { ManageRolesModal } from "./ManageRolesModal";
import { OtpVerificationModal } from "./OtpVerificationModal";
import { StaffFiltersBar } from "./StaffFiltersBar";
import { StaffGrid } from "./StaffGrid";
import { StaffPerformanceSection } from "./StaffPerformanceSection";
import { StaffSummaryBar } from "./StaffSummaryBar";
import { StaffTable } from "./StaffTable";
import { ViewProfileModal } from "./ViewProfileModal";
import { STAFF_PERFORMANCES } from "./staff.data";
import type { BackendStaffMember, StaffFilters, StaffMember } from "./staff.types";
import { calcStaffSummary, filterStaff } from "./staff.utils";

const DEFAULT_FILTERS: StaffFilters = {
  search: "",
  role: "All",
  status: "All",
  employmentType: "All",
  specialization: "All",
};

function toStaffMember(b: BackendStaffMember): StaffMember {
  return {
    id: b.id,
    fullName: b.user.fullName,
    phone: b.user.phone,
    email: b.user.email,
    nationalId: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    role: b.role as StaffMember["role"],
    employmentType: "Full Time",
    specializations: [],
    dateJoined: b.createdAt,
    salaryRate: 0,
    notes: "",
    status: b.user.isActive ? "Active" : "Inactive",
    username: b.user.email,
  };
}

export function StaffPage() {
  const storeId = useAuthStore((s) => s.user?.storeId);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StaffFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [viewTarget, setViewTarget] = useState<StaffMember | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<StaffMember | null>(null);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState<string | null>(null);

  const loadStaff = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await fetchStaff(storeId);
      setStaff(data.map(toStaffMember));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const filtered = filterStaff(staff, filters);
  const summary = calcStaffSummary(staff, STAFF_PERFORMANCES);

  function handleSaved(phone?: string) {
    setEditTarget(null);
    if (phone) {
      setOtpPhone(phone);
    } else {
      loadStaff();
    }
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
        subtitle="Manage your team, track performance and control system access"
        action={(
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              size="small"
              onClick={() => {
                setEditTarget(null);
                setAddOpen(true);
              }}
            >
              Add Staff
            </Button>
            <IconButton
              size="small"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MoreVertOutlined />
            </IconButton>
          </Box>
        )}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setRolesOpen(true);
          }}
          sx={{ gap: 1, fontSize: 13 }}
        >
          <SettingsOutlined fontSize="small" /> Manage Roles
        </MenuItem>
      </Menu>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : staff.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">No staff members yet</Typography>
        </Box>
      ) : (
        <>
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
        </>
      )}

      <AddStaffModal
        open={addOpen}
        editing={editTarget}
        onClose={() => {
          setAddOpen(false);
          setEditTarget(null);
        }}
        onSaved={handleSaved}
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

      <OtpVerificationModal
        open={otpPhone !== null}
        phone={otpPhone ?? ""}
        onClose={() => setOtpPhone(null)}
        onVerified={() => {
          setOtpPhone(null);
          loadStaff();
        }}
      />
    </Box>
  );
}
