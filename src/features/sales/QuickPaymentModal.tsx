import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useUpdateJob } from "./sales.api";
import type { Job, PaymentMethod, PaymentStatus } from "./sales.types";
import { formatKsh } from "./sales.utils";

type Props = {
  open: boolean;
  job: Job;
  onClose: () => void;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Mpesa",
  "Card",
  "Bank Transfer",
];

export function QuickPaymentModal({ open, job, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const updateJob = useUpdateJob();

  const grandTotal = Number(job.grandTotal) || 0;

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(job.paymentStatus);
  const [depositAmount, setDepositAmount] = useState(
    job.depositAmount ? String(job.depositAmount) : "",
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(job.paymentMethod);
  const [mpesaRef, setMpesaRef] = useState(job.mpesaRef || "");

  const depositNum = Number(depositAmount) || 0;
  const balanceRemaining =
    paymentStatus === "Deposit Made" ? Math.max(0, grandTotal - depositNum) : 0;

  function handleSave() {
    const payload: Record<string, unknown> = {
      storeId,
      paymentStatus,
      paymentMethod,
      balanceRemaining,
    };

    if (paymentStatus === "Deposit Made") {
      payload.depositAmount = depositNum;
    } else {
      payload.depositAmount = null;
    }

    if (paymentMethod === "Mpesa" && mpesaRef) {
      payload.mpesaRef = mpesaRef;
    }

    updateJob.mutate(
      { jobId: job.id, payload },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={800}>
          Update Payment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {job.jobRef} — {job.customerName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 1,
            alignItems: "center",
            mb: 3,
            p: 1.5,
            bgcolor: "rgba(31, 41, 51, 0.03)",
            border: 1,
            borderColor: "rgba(31, 41, 51, 0.08)",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Job Total
          </Typography>
          <Typography variant="h6" fontWeight={800} color="primary">
            {formatKsh(grandTotal)}
          </Typography>
        </Box>

        <FormControl sx={{ mb: 2, width: "100%" }}>
          <FormLabel>Payment Status</FormLabel>
          <RadioGroup
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 0.75,
              mt: 1,
            }}
          >
            <FormControlLabel
              value="Paid"
              control={<Radio />}
              label="Paid"
              sx={{ m: 0, px: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
            />
            <FormControlLabel
              value="Deposit Made"
              control={<Radio />}
              label="Deposit"
              sx={{ m: 0, px: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
            />
            <FormControlLabel
              value="Unpaid"
              control={<Radio />}
              label="Unpaid"
              sx={{ m: 0, px: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
            />
          </RadioGroup>
        </FormControl>

        {paymentStatus === "Deposit Made" && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Deposit Amount"
                fullWidth
                size="small"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                slotProps={{ htmlInput: { min: 0, max: grandTotal } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Balance"
                fullWidth
                size="small"
                value={formatKsh(balanceRemaining)}
                slotProps={{ input: { readOnly: true } }}
                sx={{ "& .MuiInputBase-input": { color: "error.main", fontWeight: 700 } }}
              />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Payment Method"
              fullWidth
              size="small"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {paymentMethod === "Mpesa" && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="M-Pesa Ref"
                fullWidth
                size="small"
                value={mpesaRef}
                onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                placeholder="QH7L2K9XP3"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateJob.isPending}
        >
          {updateJob.isPending ? "Saving..." : "Save Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
