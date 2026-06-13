import {
  EditOutlined,
  SendOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
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
import { CUSTOMERS_PER_PAGE, TIER_COLOR } from "./customers.constants";
import type { Customer } from "./customers.types";
import { deriveCustomerTier } from "./customers.types";
import { formatDate, formatKsh, getInitials } from "./customers.utils";

type SortKey = "fullName" | "totalVisits" | "lastVisit" | "totalSpent";
type SortDir = "asc" | "desc";

type Props = {
  customers: Customer[];
  onView: (c: Customer) => void;
  onSendOffer: (c: Customer) => void;
  onEdit: (c: Customer) => void;
};

export function CustomerTable({
  customers,
  onView,
  onSendOffer,
  onEdit,
}: Props) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("lastVisit");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = [...customers].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(
    page * CUSTOMERS_PER_PAGE,
    page * CUSTOMERS_PER_PAGE + CUSTOMERS_PER_PAGE,
  );

  function col(
    key: SortKey,
    label: string,
    align: "left" | "right" | "center" = "left",
  ) {
    return (
      <TableCell
        align={align}
        sortDirection={sortKey === key ? sortDir : false}
      >
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
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Cars</TableCell>
              <TableCell>Tier</TableCell>
              {col("totalVisits", "Visits", "center")}
              {col("lastVisit", "Last Visit")}
              {col("totalSpent", "Total Spent", "right")}
              <TableCell align="right">Points</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No customers match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((c, idx) => {
                const tier = deriveCustomerTier(c);
                const tc = TIER_COLOR[tier];
                return (
                  <TableRow
                    key={c.id}
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
                            width: 30,
                            height: 30,
                            bgcolor: `${tc}22`,
                            color: tc,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(c.fullName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {c.fullName}
                          </Typography>
                          {c.birthday &&
                            new Date(c.birthday).getMonth() ===
                              new Date().getMonth() && (
                              <Typography variant="caption">
                                🎂 Birthday this month
                              </Typography>
                            )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{c.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{c.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {c.vehicles.length} vehicle
                        {c.vehicles.length !== 1 ? "s" : ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tier}
                        size="small"
                        sx={{ bgcolor: `${tc}18`, color: tc, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {c.totalVisits}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDate(c.lastVisit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatKsh(c.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption">
                        {c.loyaltyPoints.toLocaleString()}
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
                          <IconButton size="small" onClick={() => onView(c)}>
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Offer">
                          <IconButton
                            size="small"
                            onClick={() => onSendOffer(c)}
                          >
                            <SendOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(c)}>
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
        count={customers.length}
        page={page}
        rowsPerPage={CUSTOMERS_PER_PAGE}
        rowsPerPageOptions={[CUSTOMERS_PER_PAGE]}
        onPageChange={(_, p) => setPage(p)}
      />
    </Paper>
  );
}
