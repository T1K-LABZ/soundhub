import { EditOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  ROLE_COLOR,
  STAFF_ROWS_PER_PAGE,
  STATUS_COLOR,
} from "./staff.constants";
import type { StaffMember, StaffPerformance } from "./staff.types";
import { formatJoinDate, formatKsh, getInitials } from "./staff.utils";

type SortKey = "fullName" | "role" | "status" | "dateJoined";
type SortDir = "asc" | "desc";

type Props = {
  staff: StaffMember[];
  performances: StaffPerformance[];
  onView: (s: StaffMember) => void;
  onEdit: (s: StaffMember) => void;
};

export function StaffTable({ staff, performances, onView, onEdit }: Props) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = [...staff].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(
    page * STAFF_ROWS_PER_PAGE,
    page * STAFF_ROWS_PER_PAGE + STAFF_ROWS_PER_PAGE,
  );

  function col(key: SortKey, label: string) {
    return (
      <TableCell sortDirection={sortKey === key ? sortDir : false}>
        <TableSortLabel
          active={sortKey === key}
          direction={sortKey === key ? sortDir : "asc"}
          onClick={() => handleSort(key)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              {col("fullName", "Name")}
              {col("role", "Role")}
              <TableCell>Specialization</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Employment</TableCell>
              {col("status", "Status")}
              <TableCell align="right">Jobs / Month</TableCell>
              <TableCell align="right">Revenue / Month</TableCell>
              {col("dateJoined", "Date Joined")}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No staff members match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((s, idx) => {
                const perf = performances.find((p) => p.staffId === s.id);
                const roleColor = ROLE_COLOR[s.role];
                const statusColor = STATUS_COLOR[s.status];

                return (
                  <TableRow
                    key={s.id}
                    sx={{
                      bgcolor:
                        idx % 2 === 0
                          ? "background.paper"
                          : "background.default",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: `${roleColor}22`,
                            color: roleColor,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(s.fullName)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {s.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.role}
                        size="small"
                        sx={{
                          bgcolor: `${roleColor}18`,
                          color: roleColor,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {s.specializations.join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{s.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {s.employmentType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        size="small"
                        sx={{
                          bgcolor: `${statusColor}18`,
                          color: statusColor,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {perf?.jobsThisMonth ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {perf ? formatKsh(perf.revenueThisMonth) : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatJoinDate(s.dateJoined)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title="View Profile">
                          <IconButton size="small" onClick={() => onView(s)}>
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(s)}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={staff.length}
        page={page}
        rowsPerPage={STAFF_ROWS_PER_PAGE}
        rowsPerPageOptions={[STAFF_ROWS_PER_PAGE]}
        onPageChange={(_, p) => setPage(p)}
      />
    </Paper>
  );
}
