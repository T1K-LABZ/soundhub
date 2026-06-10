import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { OutstandingPayment } from "./reports.types";
import { DAYS_OUTSTANDING_COLOR } from "./reports.constants";
import { formatKsh } from "./reports.utils";

type Props = { outstanding: OutstandingPayment[] };

export function ReportsOutstandingSection({ outstanding }: Props) {
  const totalBalance = outstanding.reduce((s, o) => s + o.balanceOwed, 0);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Outstanding Payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {outstanding.length} job{outstanding.length !== 1 ? "s" : ""} with
            pending balances
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#fee2e2",
            color: "#DC2626",
            borderRadius: 2,
            px: 2,
            py: 0.8,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {formatKsh(totalBalance)}
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, border: "1.5px solid #DC2626" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fee2e2" }}>
                  {[
                    "Customer",
                    "Phone",
                    "Car",
                    "Job Ref",
                    "Date",
                    "Total",
                    "Paid",
                    "Balance",
                    "Days",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        color: "#DC2626",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {outstanding.map((o) => (
                  <TableRow key={o.id} hover>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                      {o.customerName}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                      {o.customerPhone}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{o.carPlate}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>
                      {o.jobRef}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{o.date}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {formatKsh(o.grandTotal)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: "#16A34A" }}>
                      {formatKsh(o.amountPaid)}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}
                    >
                      {formatKsh(o.balanceOwed)}
                    </TableCell>
                    {/* Color-coded days outstanding */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          bgcolor:
                            DAYS_OUTSTANDING_COLOR(o.daysOutstanding) + "22",
                          color: DAYS_OUTSTANDING_COLOR(o.daysOutstanding),
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {o.daysOutstanding}d
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.8 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            fontSize: 10,
                            py: 0.4,
                            px: 1,
                            minWidth: 0,
                            bgcolor: "#16A34A",
                            "&:hover": { bgcolor: "#15803d" },
                          }}
                        >
                          Mark Paid
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: 10, py: 0.4, px: 1, minWidth: 0 }}
                        >
                          View
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {outstanding.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.disabled",
                        fontSize: 13,
                      }}
                    >
                      No outstanding payments 🎉
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Bold total footer */}
          {outstanding.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                px: 2,
                py: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="body2" fontWeight={700} color="#DC2626">
                Total Outstanding: {formatKsh(totalBalance)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
