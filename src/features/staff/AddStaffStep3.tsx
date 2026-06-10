import {
  Box,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { PERMISSION_LEVELS, PERMISSION_PAGES } from "./staff.constants";
import type {
  AddStaffForm,
  PagePermissions,
  PermissionLevel,
} from "./staff.types";

type Props = {
  form: AddStaffForm;
  onChange: <K extends keyof AddStaffForm>(k: K, v: AddStaffForm[K]) => void;
};

const LEVEL_COLOR: Record<PermissionLevel, string> = {
  none: "#94a3b8",
  view: "#2563EB",
  add: "#16A34A",
  edit: "#D97706",
  delete: "#DC2626",
};

const PAGE_LABELS: Record<(typeof PERMISSION_PAGES)[number], string> = {
  dashboard: "Dashboard",
  products: "Products",
  inventory: "Inventory",
  sales: "Sales",
  reports: "Reports",
  staff: "Staff",
  settings: "Settings",
};

export function AddStaffStep3({ form, onChange }: Props) {
  function setPermission(page: keyof PagePermissions, level: PermissionLevel) {
    onChange("permissions", { ...form.permissions, [page]: level });
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Username"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          fullWidth
          required
          helperText="Used to log into the system"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Temporary Password"
          type="password"
          value={form.tempPassword}
          onChange={(e) => onChange("tempPassword", e.target.value)}
          fullWidth
          required
          helperText="Staff must change on first login"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Permissions Matrix
        </Typography>
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>Page / Feature</TableCell>
                <TableCell>Access Level</TableCell>
                <TableCell>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PERMISSION_PAGES.map((page) => {
                const level = form.permissions[page];
                return (
                  <TableRow key={page}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {PAGE_LABELS[page]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={level}
                        onChange={(e) =>
                          setPermission(page, e.target.value as PermissionLevel)
                        }
                        sx={{ minWidth: 100 }}
                      >
                        {PERMISSION_LEVELS.map((l) => (
                          <MenuItem key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {PERMISSION_LEVELS.filter((l) => l !== "none").map(
                          (l) => (
                            <Chip
                              key={l}
                              label={l}
                              size="small"
                              sx={{
                                opacity:
                                  PERMISSION_LEVELS.indexOf(level) >=
                                  PERMISSION_LEVELS.indexOf(l)
                                    ? 1
                                    : 0.25,
                                bgcolor: `${LEVEL_COLOR[l]}22`,
                                color: LEVEL_COLOR[l],
                                fontWeight: 600,
                                fontSize: "0.65rem",
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}
