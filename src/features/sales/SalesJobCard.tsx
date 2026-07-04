import {
  EditOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
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
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 1 },
      }}
      onClick={onToggle}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header: Job Ref + Date + Amount */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {job.jobRef}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatJobDate(job.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              {formatKsh(Number(job.grandTotal) || 0)}
            </Typography>
            {expanded ? (
              <ExpandLessOutlined fontSize="small" color="action" />
            ) : (
              <ExpandMoreOutlined fontSize="small" color="action" />
            )}
          </Box>
        </Box>

        {/* Customer + Vehicle */}
        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {job.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {job.customerPhone}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {job.carPlate}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {job.carMake} {job.carModel}
            </Typography>
          </Box>
        </Box>

        {/* Chips row */}
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

        {/* Actions */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View">
            <IconButton size="small" onClick={onView}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Expanded details */}
        <Collapse in={expanded} unmountOnExit>
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "background.default",
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
