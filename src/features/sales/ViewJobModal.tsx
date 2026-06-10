import { PrintOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { JOB_STATUS_COLOR, PAYMENT_STATUS_COLOR } from "./sales.constants";
import {
  CustomerSection,
  InstallationSection,
  PaymentSection,
  ProductsSection,
  ServicesSection,
} from "./JobDetailSections";
import type { Job } from "./sales.types";
import { formatJobDate } from "./sales.utils";

type Props = {
  open: boolean;
  job: Job | null;
  onClose: () => void;
};

export function ViewJobModal({ open, job, onClose }: Props) {
  if (!job) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/* Header — ref + status badges */}
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {job.jobRef}
          </Typography>
          <Chip
            label={job.jobStatus}
            size="small"
            sx={{
              bgcolor: `${JOB_STATUS_COLOR[job.jobStatus]}18`,
              color: JOB_STATUS_COLOR[job.jobStatus],
              fontWeight: 600,
              border: `1px solid ${JOB_STATUS_COLOR[job.jobStatus]}40`,
            }}
          />
          <Chip
            label={job.paymentStatus}
            size="small"
            sx={{
              bgcolor: `${PAYMENT_STATUS_COLOR[job.paymentStatus]}18`,
              color: PAYMENT_STATUS_COLOR[job.paymentStatus],
              fontWeight: 600,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ ml: "auto" }}
          >
            {formatJobDate(job.createdAt)}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <CustomerSection job={job} />
        <ServicesSection job={job} />
        <ProductsSection job={job} />
        <PaymentSection job={job} />
        <InstallationSection job={job} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ mr: "auto" }}>
          Close
        </Button>
        <Button
          startIcon={<PrintOutlined />}
          variant="outlined"
          onClick={() => window.print()}
        >
          Print Job Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
