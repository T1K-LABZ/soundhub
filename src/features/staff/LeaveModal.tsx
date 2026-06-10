import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { StaffMember } from "./staff.types";

type Props = {
  open: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onSave: (
    staffId: string,
    leave: {
      leaveType: "Annual" | "Sick" | "Emergency" | "Unpaid";
      leaveStart: string;
      leaveEnd: string;
      leaveNotes: string;
    },
  ) => void;
};

const LEAVE_TYPES = ["Annual", "Sick", "Emergency", "Unpaid"] as const;

const EMPTY = {
  leaveType: "Annual" as const,
  leaveStart: new Date().toISOString().split("T")[0],
  leaveEnd: "",
  leaveNotes: "",
};

export function LeaveModal({ open, staff, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...EMPTY });

  function set<K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleSave() {
    if (!staff) return;
    onSave(staff.id, form);
    setForm({ ...EMPTY });
    onClose();
  }

  const isValid = form.leaveStart !== "" && form.leaveEnd !== "";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Mark as On Leave
        {staff && (
          <Typography variant="body2" color="text.secondary">
            {staff.fullName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Leave Type"
              value={form.leaveType}
              onChange={(e) =>
                set("leaveType", e.target.value as (typeof EMPTY)["leaveType"])
              }
              fullWidth
            >
              {LEAVE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Start Date"
              type="date"
              value={form.leaveStart}
              onChange={(e) => set("leaveStart", e.target.value)}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Expected Return"
              type="date"
              value={form.leaveEnd}
              onChange={(e) => set("leaveEnd", e.target.value)}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Notes"
              value={form.leaveNotes}
              onChange={(e) => set("leaveNotes", e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Reason or additional info…"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
