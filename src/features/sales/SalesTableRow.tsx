import {
  EditOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  PrintOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
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

// ── StatusChip ────────────────────────────────────────────────────────────────

export function StatusChip({ label, color }: { label: string; color: string }) {
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
      }}
    />
  );
}

// ── Expanded row notes preview ────────────────────────────────────────────────

function ExpandedDetail({ job }: { job: Job }) {
  return (
    <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={0.5}
      >
        Installation Notes
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {job.installationNotes || "—"}
      </Typography>
      {job.issuesEncountered && (
        <>
          <Typography
            variant="caption"
            color="warning.main"
            display="block"
            mt={1}
          >
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
  );
}

// ── SalesTableRow ─────────────────────────────────────────────────────────────

type Props = {
  job: Job;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onPrint: () => void;
};

export function SalesTableRow({
  job,
  index,
  expanded,
  onToggle,
  onView,
  onEdit,
  onPrint,
}: Props) {
  return (
    <>
      <TableRow
        sx={{
          bgcolor: index % 2 === 0 ? "background.paper" : "background.default",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        {/* Expand toggle */}
        <TableCell padding="checkbox">
          <IconButton size="small">
            {expanded ? (
              <ExpandLessOutlined fontSize="small" />
            ) : (
              <ExpandMoreOutlined fontSize="small" />
            )}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography variant="caption">
            {formatJobDate(job.createdAt)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight={600}>
            {job.jobRef}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight={500}>
            {job.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {job.customerPhone}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{job.carPlate}</Typography>
          <Typography variant="caption" color="text.secondary">
            {job.carMake} {job.carModel} {job.carYear}
          </Typography>
        </TableCell>

        <TableCell>
          <StatusChip
            label={job.serviceType}
            color={SERVICE_TYPE_COLOR[job.serviceType]}
          />
        </TableCell>

        <TableCell>
          <Typography variant="caption">{job.technicianName}</Typography>
        </TableCell>

        <TableCell align="right">
          <Typography variant="body2" fontWeight={700}>
            {formatKsh(Number(job.grandTotal) || 0)}
          </Typography>
        </TableCell>

        <TableCell>
          <StatusChip
            label={job.paymentStatus}
            color={PAYMENT_STATUS_COLOR[job.paymentStatus]}
          />
        </TableCell>

        <TableCell>
          <Typography variant="caption">{job.paymentMethod}</Typography>
        </TableCell>

        <TableCell align="center">
          <StatusChip
            label={job.jobStatus}
            color={JOB_STATUS_COLOR[job.jobStatus]}
          />
        </TableCell>

        {/* Actions — stop propagation so clicks don't toggle the row */}
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
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
            <Tooltip title="Print">
              <IconButton size="small" onClick={onPrint}>
                <PrintOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <TableRow>
        <TableCell colSpan={12} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} unmountOnExit>
            <ExpandedDetail job={job} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
