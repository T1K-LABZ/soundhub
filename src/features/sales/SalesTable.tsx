import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SALES_ROWS_PER_PAGE } from "./sales.constants";
import { SalesTableRow } from "./SalesTableRow";
import type { Job } from "./sales.types";

type SortKey = "createdAt" | "grandTotal" | "jobStatus";
type SortDir = "asc" | "desc";

type Props = {
  jobs: Job[];
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onPrint: (job: Job) => void;
};

export function SalesTable({ jobs, onView, onEdit, onPrint }: Props) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = [...jobs].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(
    page * SALES_ROWS_PER_PAGE,
    page * SALES_ROWS_PER_PAGE + SALES_ROWS_PER_PAGE,
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
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell padding="checkbox" />
              {col("createdAt", "Date")}
              <TableCell>Job Ref</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Technician</TableCell>
              {col("grandTotal", "Amount", "right")}
              <TableCell>Payment</TableCell>
              <TableCell>Method</TableCell>
              {col("jobStatus", "Job Status", "center")}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No jobs match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((job, idx) => (
                <SalesTableRow
                  key={job.id}
                  job={job}
                  index={idx}
                  expanded={expandedId === job.id}
                  onToggle={() =>
                    setExpandedId(expandedId === job.id ? null : job.id)
                  }
                  onView={() => onView(job)}
                  onEdit={() => onEdit(job)}
                  onPrint={() => onPrint(job)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={jobs.length}
        page={page}
        rowsPerPage={SALES_ROWS_PER_PAGE}
        rowsPerPageOptions={[SALES_ROWS_PER_PAGE]}
        onPageChange={(_, p) => setPage(p)}
      />
    </Paper>
  );
}
