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

export function CustomerSection({ job }: { job: Job }) {
  return (
    <>
      <Section title="Customer" />
      <Typography variant="body2" fontWeight={600}>
        {job.customerName}
      </Typography>
      <Typography variant="body2">{job.customerPhone}</Typography>
      {job.customerEmail && (
        <Typography variant="body2">{job.customerEmail}</Typography>
      )}
      <Section title="Vehicle" />
      <Typography variant="body2" fontWeight={600}>
        {job.carPlate}
      </Typography>
      <Typography variant="body2">
        {job.carMake} {job.carModel} {job.carVariant} — {job.carYear}
      </Typography>
    </>
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
              <TableCell align="right">{formatKsh(svc.basePrice)}</TableCell>
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
                <TableCell align="right">{formatKsh(p.unitPrice)}</TableCell>
                <TableCell align="right">{formatKsh(p.lineTotal)}</TableCell>
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
  const depositNum = job.depositAmount ?? 0;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Section title="Payment" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          maxWidth: 300,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Products
          </Typography>
          <Typography variant="body2">
            {formatKsh(job.productsSubtotal)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Services
          </Typography>
          <Typography variant="body2">
            {formatKsh(job.servicesSubtotal)}
          </Typography>
        </Box>
        {job.discount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Typography variant="body2" color="success.main">
              −{formatKsh(job.discount)}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight={700}>
            Grand Total
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatKsh(job.grandTotal)}
          </Typography>
        </Box>
        {job.paymentStatus === "Deposit Made" && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Deposit Paid
              </Typography>
              <Typography variant="body2" color="success.main">
                {formatKsh(depositNum)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="error.main" fontWeight={700}>
                Balance Due
              </Typography>
              <Typography variant="body2" color="error.main" fontWeight={700}>
                {formatKsh(job.balanceRemaining ?? 0)}
              </Typography>
            </Box>
          </>
        )}
        <Typography variant="caption" color="text.secondary" mt={0.5}>
          {job.paymentMethod}
          {job.mpesaRef ? ` — Ref: ${job.mpesaRef}` : ""} ·{" "}
          {formatJobDate(job.paymentDate)}
        </Typography>
      </Box>
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
