import {
  Box,
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
import type { PaymentMethod, PaymentStatus } from "./sales.types";
import { formatKsh } from "./sales.utils";

export type Step3Data = {
  paymentStatus: PaymentStatus;
  depositAmount: string;
  paymentMethod: PaymentMethod;
  mpesaRef: string;
  paymentDate: string;
};

type Props = {
  data: Step3Data;
  grandTotal: number;
  onChange: (data: Step3Data) => void;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Mpesa",
  "Card",
  "Bank Transfer",
];

export function NewSaleStep3({ data, grandTotal, onChange }: Props) {
  function set<K extends keyof Step3Data>(key: K, value: Step3Data[K]) {
    onChange({ ...data, [key]: value });
  }

  const depositNum = Number(data.depositAmount) || 0;
  const balance = Math.max(0, grandTotal - depositNum);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          bgcolor: "rgba(31, 41, 51, 0.03)",
          border: 1,
          borderColor: "rgba(31, 41, 51, 0.08)",
          borderRadius: 1,
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          Job Total
        </Typography>
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ whiteSpace: "nowrap" }}>
          {formatKsh(grandTotal)}
        </Typography>
      </Box>

      <FormControl sx={{ mb: 3, width: "100%" }}>
        <FormLabel>Payment Status</FormLabel>
        <RadioGroup
          value={data.paymentStatus}
          onChange={(e) =>
            set("paymentStatus", e.target.value as PaymentStatus)
          }
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
            gap: 0.75,
            mt: 1,
          }}
        >
          <FormControlLabel
            value="Paid"
            control={<Radio />}
            label="Paid in Full"
            sx={{ m: 0, px: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
          />
          <FormControlLabel
            value="Deposit Made"
            control={<Radio />}
            label="Deposit Made"
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

      {data.paymentStatus === "Deposit Made" && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Deposit Amount (KES)"
              fullWidth
              size="small"
              type="number"
              value={data.depositAmount}
              onChange={(e) => set("depositAmount", e.target.value)}
              slotProps={{ htmlInput: { min: 0, max: grandTotal } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Balance Remaining"
              fullWidth
              size="small"
              value={formatKsh(balance)}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                "& .MuiInputBase-input": {
                  color: "error.main",
                  fontWeight: 700,
                },
              }}
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
            value={data.paymentMethod}
            onChange={(e) =>
              set("paymentMethod", e.target.value as PaymentMethod)
            }
          >
            {PAYMENT_METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {data.paymentMethod === "Mpesa" && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="M-Pesa Reference"
              fullWidth
              size="small"
              value={data.mpesaRef}
              onChange={(e) => set("mpesaRef", e.target.value.toUpperCase())}
              placeholder="QH7L2K9XP3"
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Payment Date"
            type="date"
            fullWidth
            size="small"
            value={data.paymentDate}
            onChange={(e) => set("paymentDate", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
