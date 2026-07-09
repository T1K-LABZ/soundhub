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
      mt={2.25}
      mb={0.75}
      sx={{ fontWeight: 800, letterSpacing: 0 }}
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 0.75, minWidth: 0 }}>
      <Box
        sx={{
          color: "primary.main",
          bgcolor: "rgba(247, 0, 0, 0.08)",
          borderRadius: 1,
          width: 30,
          height: 30,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" lineHeight={1}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700} noWrap>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export function CustomerSection({ job }: { job: Job }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(31, 41, 51, 0.03)",
          borderRadius: 1,
          p: 2,
          border: "1px solid",
          borderColor: "rgba(31, 41, 51, 0.08)",
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

      <Box
        sx={{
          bgcolor: "rgba(31, 41, 51, 0.03)",
          borderRadius: 1,
          p: 2,
          border: "1px solid",
          borderColor: "rgba(31, 41, 51, 0.08)",
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
  if (job.services.length === 0) return null;

  return (
    <>
      <Section title="Services" />
      <Box
        sx={{
          border: 1,
          borderColor: "rgba(31, 41, 51, 0.08)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
      <Table size="small" sx={{ "& td": { borderColor: "rgba(31, 41, 51, 0.08)" } }}>
        <TableBody>
          {job.services.map((svc) => (
            <TableRow key={svc.id}>
              <TableCell>
                <Typography variant="body2" fontWeight={700}>{svc.name}</Typography>
                <Typography variant="caption" color="text.secondary">{svc.code}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={800}>
                  {formatKsh(Number(svc.basePrice) || 0)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>
    </>
  );
}

export function ProductsSection({ job }: { job: Job }) {
  return (
    <>
      <Section title="Products" />
      {job.products.length === 0 ? (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            border: 1,
            borderColor: "rgba(31, 41, 51, 0.08)",
            borderRadius: 1,
            bgcolor: "rgba(31, 41, 51, 0.03)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No products added to this job
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: 1,
            borderColor: "rgba(31, 41, 51, 0.08)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Table size="small" sx={{ "& td": { borderColor: "rgba(31, 41, 51, 0.08)" } }}>
            <TableBody>
              {job.products.map((p, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>{p.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty {p.quantity} x {formatKsh(Number(p.unitPrice) || 0)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={800}>
                    {formatKsh(Number(p.lineTotal) || 0)}
                  </Typography>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
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
      <Divider sx={{ my: 2.25 }} />
      <Section title="Payment" />

      <Box
        sx={{
          background: "linear-gradient(135deg, #1F2933 0%, #2D2F99 100%)",
          borderRadius: 1.5,
          p: 2.5,
          mb: 2,
          color: "white",
          boxShadow: "0 16px 36px rgba(31, 41, 51, 0.18)",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8, mb: 0.5, display: "block", fontWeight: 800 }}>
          GRAND TOTAL
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>
          {formatKsh(grandTotal)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center", flexWrap: "wrap" }}>
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
          <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>
            {job.paymentMethod}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "rgba(31, 41, 51, 0.03)",
          borderRadius: 1,
          p: 1.5,
          border: "1px solid",
          borderColor: "rgba(31, 41, 51, 0.08)",
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

      {job.paymentStatus === "Deposit Made" && (
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
              flex: 1,
              bgcolor: "rgba(22, 163, 74, 0.08)",
              borderRadius: 1,
              p: 1.5,
              border: "1px solid",
              borderColor: "rgba(22, 163, 74, 0.28)",
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
              bgcolor: "rgba(220, 38, 38, 0.08)",
              borderRadius: 1,
              p: 1.5,
              border: "1px solid",
              borderColor: "rgba(220, 38, 38, 0.28)",
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

      {(job.mpesaRef || job.paymentDate) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            px: 1.5,
            py: 1,
            bgcolor: "rgba(31, 41, 51, 0.04)",
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
      <Divider sx={{ my: 2.25 }} />
      <Section title="Installation Notes" />
      <Box
        sx={{
          p: 1.5,
          border: 1,
          borderColor: "rgba(31, 41, 51, 0.08)",
          borderRadius: 1,
          bgcolor: "rgba(31, 41, 51, 0.03)",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {job.installationNotes || "No installation notes recorded."}
        </Typography>
      </Box>

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

      <Divider sx={{ my: 2.25 }} />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
          p: 1.25,
          border: 1,
          borderColor: "rgba(31, 41, 51, 0.08)",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">Difficulty</Typography>
        <Chip
          label={job.difficultyRating}
          size="small"
          sx={{
            bgcolor: `${DIFFICULTY_COLOR[job.difficultyRating]}18`,
            color: DIFFICULTY_COLOR[job.difficultyRating],
            fontWeight: 600,
          }}
        />
        <Typography variant="body2" sx={{ ml: { xs: 0, sm: 1 } }}>
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
