import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import type { OutstandingPayment } from "./reports.types";
import { DAYS_OUTSTANDING_COLOR } from "./reports.constants";
import { formatKsh } from "./reports.utils";

type Props = { outstanding: OutstandingPayment[] };

function OutstandingCard({ item }: { item: OutstandingPayment }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="caption" color="text.secondary">{item.date}</Typography>
          <Box
            sx={{
              display: "inline-block",
              px: 1,
              py: 0.3,
              borderRadius: 1,
              bgcolor: DAYS_OUTSTANDING_COLOR(item.daysOutstanding) + "22",
              color: DAYS_OUTSTANDING_COLOR(item.daysOutstanding),
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {item.daysOutstanding}d outstanding
          </Box>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
          {item.customerName}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {item.customerPhone} · {item.carPlate}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Job Ref</Typography>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{item.jobRef}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography variant="caption" fontWeight={700}>{formatKsh(item.grandTotal)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Paid</Typography>
          <Typography variant="caption" fontWeight={700} color="#16A34A">{formatKsh(item.amountPaid)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Balance Owed</Typography>
          <Typography variant="caption" fontWeight={700} color="#DC2626">{formatKsh(item.balanceOwed)}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{
              fontSize: 11,
              py: 0.5,
              bgcolor: "#16A34A",
              "&:hover": { bgcolor: "#15803d" },
            }}
          >
            Mark Paid
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{ fontSize: 11, py: 0.5 }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export function ReportsOutstandingSection({ outstanding }: Props) {
  const totalBalance = outstanding.reduce((s, o) => s + o.balanceOwed, 0);

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
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

      {outstanding.length === 0 ? (
        <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <CardContent>
            <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
              No outstanding payments
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {outstanding.map((o) => (
            <Grid key={o.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <OutstandingCard item={o} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
