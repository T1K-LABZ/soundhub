import {
  EditOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  PaymentsOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  JOB_STATUS_COLOR,
  PAYMENT_STATUS_COLOR,
  SERVICE_TYPE_COLOR,
} from "./sales.constants";
import type { Job } from "./sales.types";
import { formatJobDate, formatKsh } from "./sales.utils";

type Props = {
  job: Job;
  expanded: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onPayment?: () => void;
};

function StatusChip({ label, color }: { label: string; color: string }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: `${color}18`,
        color,
        fontWeight: 600,
        border: `1px solid ${color}40`,
        fontSize: "0.7rem",
        height: 22,
      }}
    />
  );
}

export function SalesJobCard({
  job,
  expanded,
  onToggle,
  onView,
  onEdit,
  onPayment,
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "pointer",
        overflow: "hidden",
        borderColor: "rgba(31, 41, 51, 0.08)",
        boxShadow: "0 10px 28px rgba(31, 41, 51, 0.05)",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "rgba(247, 0, 0, 0.2)",
          boxShadow: "0 16px 36px rgba(31, 41, 51, 0.1)",
          transform: "translateY(-1px)",
        },
      }}
      onClick={onToggle}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 1.25,
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {job.jobRef}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatJobDate(job.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography variant="subtitle1" fontWeight={800} color="primary" sx={{ whiteSpace: "nowrap" }}>
              {formatKsh(Number(job.grandTotal) || 0)}
            </Typography>
            {expanded ? (
              <ExpandLessOutlined fontSize="small" color="action" />
            ) : (
              <ExpandMoreOutlined fontSize="small" color="action" />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(31, 41, 51, 0.04)",
              border: "1px solid rgba(31, 41, 51, 0.06)",
              borderRadius: 1,
              px: 1.25,
              py: 1,
              minWidth: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Customer
            </Typography>
            <Typography variant="body2" fontWeight={700} noWrap>
              {job.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {job.customerPhone}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "rgba(31, 41, 51, 0.04)",
              border: "1px solid rgba(31, 41, 51, 0.06)",
              borderRadius: 1,
              px: 1.25,
              py: 1,
              minWidth: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Vehicle
            </Typography>
            <Typography variant="body2" fontWeight={700} noWrap>
              {job.carPlate}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {job.carMake} {job.carModel}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
          <StatusChip
            label={job.serviceType}
            color={SERVICE_TYPE_COLOR[job.serviceType]}
          />
          <StatusChip
            label={job.paymentStatus}
            color={PAYMENT_STATUS_COLOR[job.paymentStatus]}
          />
          <StatusChip
            label={job.jobStatus}
            color={JOB_STATUS_COLOR[job.jobStatus]}
          />
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={onView}
              sx={{
                width: 34,
                height: 34,
                bgcolor: "rgba(31, 41, 51, 0.04)",
                "&:hover": { color: "primary.main", bgcolor: "rgba(247, 0, 0, 0.08)" },
              }}
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          {job.paymentStatus !== "Paid" && onPayment && (
            <Tooltip title="Update Payment">
              <IconButton
                size="small"
                onClick={onPayment}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "rgba(247, 0, 0, 0.06)",
                  color: "primary.main",
                  "&:hover": { bgcolor: "rgba(247, 0, 0, 0.12)" },
                }}
              >
                <PaymentsOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                width: 34,
                height: 34,
                bgcolor: "rgba(31, 41, 51, 0.04)",
                "&:hover": { color: "primary.main", bgcolor: "rgba(247, 0, 0, 0.08)" },
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={expanded} unmountOnExit>
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "rgba(31, 41, 51, 0.03)",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Technician
            </Typography>
            <Typography variant="body2" mb={1}>
              {job.technicianName}
            </Typography>

            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Installation Notes
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }} mb={1}>
              {job.installationNotes || "—"}
            </Typography>

            {job.issuesEncountered && (
              <>
                <Typography variant="caption" color="warning.main" display="block" mb={0.5}>
                  Issues: {job.issuesEncountered}
                </Typography>
                {job.issuesResolution && (
                  <Typography variant="caption" color="success.main" display="block">
                    Resolution: {job.issuesResolution}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
