import {
  DirectionsCarOutlined,
  EmailOutlined,
  PersonOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DIFFICULTY_COLOR } from "./sales.constants";
import type { Job } from "./sales.types";
import { formatJobDate, formatKsh } from "./sales.utils";

// ── Small helpers ─────────────────────────────────────────────────────────────

export function Section({ title }: { title: string }) {
  return (
    <Typography
      variant="overline"
      color="text.secondary"
      display="block"
      mt={2}
      mb={0.5}
    >
      {title}
    </Typography>
  );
}

// ── Customer & Vehicle ────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
      <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" lineHeight={1}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500} noWrap>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export function CustomerSection({ job }: { job: Job }) {
  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 1 }}>
      {/* Customer card */}
      <Box
        sx={{
          flex: "1 1 220px",
          bgcolor: "grey.50",
          borderRadius: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          display="block"
          mb={1}
        >
          Customer
        </Typography>
        <InfoRow
          icon={<PersonOutlined fontSize="small" />}
          label="Name"
          value={job.customerName}
        />
        <InfoRow
          icon={<PhoneOutlined fontSize="small" />}
          label="Phone"
          value={job.customerPhone}
        />
        {job.customerEmail && (
          <InfoRow
            icon={<EmailOutlined fontSize="small" />}
            label="Email"
            value={job.customerEmail}
          />
        )}
      </Box>

      {/* Vehicle card */}
      <Box
        sx={{
          flex: "1 1 220px",
          bgcolor: "grey.50",
          borderRadius: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          display="block"
          mb={1}
        >
          Vehicle
        </Typography>
        <InfoRow
          icon={<DirectionsCarOutlined fontSize="small" />}
          label="Plate"
          value={job.carPlate}
        />
        <InfoRow
          icon={<DirectionsCarOutlined fontSize="small" />}
          label="Make / Model"
          value={`${job.carMake} ${job.carModel}`}
        />
        {(job.carVariant || job.carYear) && (
          <InfoRow
            icon={<DirectionsCarOutlined fontSize="small" />}
            label="Details"
            value={`${job.carVariant ? `${job.carVariant} — ` : ""}${job.carYear}`}
          />
        )}
      </Box>
    </Box>
  );
}

// ── Services & Products tables ────────────────────────────────────────────────

export function ServicesSection({ job }: { job: Job }) {
  return (
    <>
      <Section title="Services" />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Code</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {job.services.map((svc) => (
            <TableRow key={svc.id}>
              <TableCell>{svc.name}</TableCell>
              <TableCell>{svc.code}</TableCell>
              <TableCell align="right">{formatKsh(Number(svc.basePrice) || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export function ProductsSection({ job }: { job: Job }) {
  return (
    <>
      <Section title="Products" />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {job.products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No products
              </TableCell>
            </TableRow>
          ) : (
            job.products.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.productName}</TableCell>
                <TableCell align="center">{p.quantity}</TableCell>
                <TableCell align="right">{formatKsh(Number(p.unitPrice) || 0)}</TableCell>
                <TableCell align="right">{formatKsh(Number(p.lineTotal) || 0)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

// ── Payment summary ───────────────────────────────────────────────────────────

export function PaymentSection({ job }: { job: Job }) {
  const depositNum = Number(job.depositAmount) || 0;
  const productsSubtotal = Number(job.productsSubtotal) || 0;
  const servicesSubtotal = Number(job.servicesSubtotal) || 0;
  const discount = Number(job.discount) || 0;
  const grandTotal = Number(job.grandTotal) || 0;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Section title="Payment" />

      {/* Grand total hero card */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
          borderRadius: 2,
          p: 2.5,
          mb: 2,
          color: "white",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8, mb: 0.5, display: "block" }}>
          GRAND TOTAL
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {formatKsh(grandTotal)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
          <Chip
            label={job.paymentStatus}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8, alignSelf: "center" }}>
            {job.paymentMethod}
          </Typography>
        </Box>
      </Box>

      {/* Discount + subtotal */}
      <Box
        sx={{
          bgcolor: "grey.50",
          borderRadius: 1.5,
          p: 1.5,
          border: "1px solid",
          borderColor: "divider",
          mb: 1.5,
        }}
      >
        {discount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={600}>
              −{formatKsh(discount)}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight={700}>
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatKsh(productsSubtotal + servicesSubtotal - discount)}
          </Typography>
        </Box>
      </Box>

      {/* Deposit & balance */}
      {job.paymentStatus === "Deposit Made" && (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: "success.light",
              borderRadius: 1.5,
              p: 1.5,
              border: "1px solid",
              borderColor: "success.main",
            }}
          >
            <Typography variant="caption" color="success.dark">
              Deposit Paid
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="success.dark">
              {formatKsh(depositNum)}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "error.light",
              borderRadius: 1.5,
              p: 1.5,
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <Typography variant="caption" color="error.dark">
              Balance Due
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="error.dark">
              {formatKsh(job.balanceRemaining ?? 0)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Payment ref */}
      {(job.mpesaRef || job.paymentDate) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            px: 1.5,
            py: 1,
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {job.mpesaRef ? `Ref: ${job.mpesaRef}` : ""}{" "}
            {job.paymentDate ? `· ${formatJobDate(job.paymentDate)}` : ""}
          </Typography>
        </Box>
      )}
    </>
  );
}

// ── Installation notes & difficulty ──────────────────────────────────────────

export function InstallationSection({ job }: { job: Job }) {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Section title="Installation Notes" />
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {job.installationNotes || "—"}
      </Typography>

      {job.issuesEncountered && (
        <>
          <Section title="Issues Encountered" />
          <Typography variant="body2" color="warning.main">
            {job.issuesEncountered}
          </Typography>
          {job.issuesResolution && (
            <>
              <Section title="Resolution" />
              <Typography variant="body2" color="success.main">
                {job.issuesResolution}
              </Typography>
            </>
          )}
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <Typography variant="body2">Difficulty:</Typography>
        <Chip
          label={job.difficultyRating}
          size="small"
          sx={{
            bgcolor: `${DIFFICULTY_COLOR[job.difficultyRating]}18`,
            color: DIFFICULTY_COLOR[job.difficultyRating],
            fontWeight: 600,
          }}
        />
        <Typography variant="body2" ml={2}>
          Follow-up: <strong>{job.followUpNeeded ? "Yes" : "No"}</strong>
        </Typography>
      </Box>
      {job.followUpNotes && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          {job.followUpNotes}
        </Typography>
      )}
    </>
  );
}
