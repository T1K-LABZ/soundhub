import {
  Box,
  Chip,
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
import { MOVEMENT_TYPE_HEX, ROWS_PER_PAGE } from "./inventory.constants";
import type { StockMovement } from "./inventory.types";
import { formatDateTime } from "./inventory.utils";

type SortKey = keyof Pick<
  StockMovement,
  "dateTime" | "productName" | "movementType" | "quantity" | "runningBalance"
>;
type SortDir = "asc" | "desc";

type Props = {
  movements: StockMovement[];
};

export function InventoryTable({ movements }: Props) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("dateTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = [...movements].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE,
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
              {col("dateTime", "Date & Time")}
              {col("productName", "Product")}
              <TableCell>Serial No.</TableCell>
              <TableCell>Category</TableCell>
              {col("movementType", "Type", "center")}
              {col("quantity", "Qty", "center")}
              <TableCell>Reason / Note</TableCell>
              <TableCell>Staff</TableCell>
              {col("runningBalance", "Balance", "right")}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No movements match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, idx) => (
                <TableRow
                  key={row.id}
                  sx={{
                    bgcolor:
                      idx % 2 === 0 ? "background.paper" : "background.default",
                  }}
                >
                  <TableCell>
                    <Typography variant="caption">
                      {formatDateTime(row.dateTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {row.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.brand}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{row.serial}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{row.category}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.movementType}
                      size="small"
                      sx={{
                        bgcolor: `${MOVEMENT_TYPE_HEX[row.movementType]}18`,
                        color: MOVEMENT_TYPE_HEX[row.movementType],
                        fontWeight: 600,
                        border: `1px solid ${MOVEMENT_TYPE_HEX[row.movementType]}40`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={row.quantity > 0 ? "success.main" : "error.main"}
                    >
                      {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {row.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{row.staff}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {row.runningBalance}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={movements.length}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        onPageChange={(_, p) => setPage(p)}
      />
    </Paper>
  );
}
