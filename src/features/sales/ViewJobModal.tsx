import { DownloadOutlined, PrintOutlined } from "@mui/icons-material";
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

function downloadJobPdf(job: Job) {
  import("jspdf").then(({ jsPDF }) => {
    import("jspdf-autotable").then(() => {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = 210;
      let y = margin;

      // ── Header bar ──
      doc.setFillColor(26, 35, 126);
      doc.rect(0, 0, pageWidth, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("SoundHub", margin, 14);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Job Card", margin, 22);

      // Job ref + date on right
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(job.jobRef, pageWidth - margin, 14, { align: "right" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(formatJobDate(job.createdAt), pageWidth - margin, 22, { align: "right" });

      y = 40;

      // ── Status chips ──
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");

      // Job status chip
      const jobStatusColors: Record<string, number[]> = {
        Pending: [255, 152, 0],
        "In Progress": [33, 150, 243],
        Completed: [76, 175, 80],
        Cancelled: [244, 67, 54],
      };
      const jsColor = jobStatusColors[job.jobStatus] || [158, 158, 158];
      doc.setFillColor(jsColor[0], jsColor[1], jsColor[2]);
      doc.roundedRect(margin, y - 4, doc.getTextWidth(job.jobStatus) + 10, 7, 2, 2, "F");
      doc.setTextColor(255);
      doc.text(job.jobStatus, margin + 5, y);

      // Payment status chip
      doc.setFont("helvetica", "normal");
      const payStatusColors: Record<string, number[]> = {
        Unpaid: [244, 67, 54],
        Paid: [76, 175, 80],
        "Deposit Made": [255, 152, 0],
      };
      const psColor = payStatusColors[job.paymentStatus] || [158, 158, 158];
      const psX = margin + doc.getTextWidth(job.jobStatus) + 18;
      doc.setFillColor(psColor[0], psColor[1], psColor[2]);
      doc.roundedRect(psX, y - 4, doc.getTextWidth(job.paymentStatus) + 10, 7, 2, 2, "F");
      doc.setTextColor(255);
      doc.text(job.paymentStatus, psX + 5, y);

      y += 14;

      // ── Customer & Vehicle — two-column cards ──
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, y, 85, 36, 2, 2, "F");
      doc.roundedRect(pageWidth - margin - 85, y, 85, 36, 2, 2, "F");

      // Customer card
      doc.setDrawColor(224, 224, 224);
      doc.roundedRect(margin, y, 85, 36, 2, 2, "S");
      doc.setTextColor(117, 117, 117);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("CUSTOMER", margin + 4, y + 6);
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(job.customerName, margin + 4, y + 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(job.customerPhone, margin + 4, y + 19);
      if (job.customerEmail) doc.text(job.customerEmail, margin + 4, y + 25);

      // Vehicle card
      doc.roundedRect(pageWidth - margin - 85, y, 85, 36, 2, 2, "S");
      doc.setTextColor(117, 117, 117);
      doc.setFontSize(7);
      doc.text("VEHICLE", pageWidth - margin - 81, y + 6);
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(job.carPlate, pageWidth - margin - 81, y + 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`${job.carMake} ${job.carModel}`, pageWidth - margin - 81, y + 19);
      doc.text(`${job.carVariant || ""} ${job.carYear}`, pageWidth - margin - 81, y + 25);

      y += 44;

      // ── Services table ──
      if (job.services.length > 0) {
        doc.setTextColor(117, 117, 117);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("SERVICES", margin, y);
        y += 4;

        (doc as any).autoTable({
          startY: y,
          margin: { left: margin, right: margin },
          head: [["Service", "Code", "Price"]],
          body: job.services.map((svc) => [
            svc.name,
            svc.code,
            `KSh ${Number(svc.basePrice).toLocaleString()}`,
          ]),
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [26, 35, 126], fontSize: 8 },
          columnStyles: { 2: { halign: "right" } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      }

      // ── Products table ──
      if (job.products.length > 0) {
        doc.setTextColor(117, 117, 117);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("PRODUCTS", margin, y);
        y += 4;

        (doc as any).autoTable({
          startY: y,
          margin: { left: margin, right: margin },
          head: [["Product", "Qty", "Unit Price", "Total"]],
          body: job.products.map((p) => [
            p.productName,
            String(p.quantity),
            `KSh ${Number(p.unitPrice).toLocaleString()}`,
            `KSh ${Number(p.lineTotal).toLocaleString()}`,
          ]),
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [26, 35, 126], fontSize: 8 },
          columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      }

      // ── Payment section ──
      doc.setDrawColor(224, 224, 224);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Grand total hero card
      doc.setFillColor(26, 35, 126);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("GRAND TOTAL", margin + 6, y + 8);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`KSh ${Number(job.grandTotal).toLocaleString()}`, margin + 6, y + 17);

      // Payment method on right
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(job.paymentMethod, pageWidth - margin - 6, y + 12, { align: "right" });
      y += 28;

      // Subtotal + discount
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const subtotal = Number(job.productsSubtotal) + Number(job.servicesSubtotal);
      doc.text(`Subtotal`, margin, y);
      doc.text(`KSh ${subtotal.toLocaleString()}`, pageWidth - margin, y, { align: "right" });
      y += 6;

      if (Number(job.discount) > 0) {
        doc.setTextColor(76, 175, 80);
        doc.text(`Discount`, margin, y);
        doc.text(`−KSh ${Number(job.discount).toLocaleString()}`, pageWidth - margin, y, { align: "right" });
        y += 6;
      }

      // Deposit / Balance
      if (job.paymentStatus === "Deposit Made") {
        const depositNum = Number(job.depositAmount) || 0;
        const balance = Number(job.balanceRemaining ?? 0);

        // Deposit card
        doc.setFillColor(232, 245, 233);
        doc.roundedRect(margin, y, 85, 16, 2, 2, "F");
        doc.setFillColor(76, 175, 80);
        doc.roundedRect(margin, y, 3, 16, 1, 1, "F");
        doc.setTextColor(27, 94, 32);
        doc.setFontSize(7);
        doc.text("DEPOSIT PAID", margin + 8, y + 5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`KSh ${depositNum.toLocaleString()}`, margin + 8, y + 12);

        // Balance card
        doc.setFillColor(255, 235, 238);
        doc.roundedRect(pageWidth - margin - 85, y, 85, 16, 2, 2, "F");
        doc.setFillColor(244, 67, 54);
        doc.roundedRect(pageWidth - margin - 85, y, 3, 16, 1, 1, "F");
        doc.setTextColor(183, 28, 28);
        doc.setFontSize(7);
        doc.text("BALANCE DUE", pageWidth - margin - 77, y + 5);
        doc.setFontSize(10);
        doc.text(`KSh ${balance.toLocaleString()}`, pageWidth - margin - 77, y + 12);
        y += 22;
      }

      // Payment ref
      if (job.mpesaRef || job.paymentDate) {
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 8, 2, 2, "F");
        doc.setTextColor(117, 117, 117);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        const refText = `${job.mpesaRef ? `Ref: ${job.mpesaRef}` : ""}${job.paymentDate ? `  ·  ${formatJobDate(job.paymentDate)}` : ""}`;
        doc.text(refText, margin + 4, y + 5);
        y += 14;
      }

      // ── Technician ──
      doc.setTextColor(117, 117, 117);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("TECHNICIAN", margin, y);
      y += 5;
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(job.technicianName || "—", margin, y);
      y += 10;

      // ── Installation Notes ──
      if (job.installationNotes) {
        doc.setTextColor(117, 117, 117);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("INSTALLATION NOTES", margin, y);
        y += 5;
        doc.setTextColor(0);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(job.installationNotes, pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 4;
      }

      if (job.issuesEncountered) {
        doc.setTextColor(255, 152, 0);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("ISSUES", margin, y);
        y += 5;
        doc.setTextColor(0);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(job.issuesEncountered, margin, y);
        y += 6;

        if (job.issuesResolution) {
          doc.setTextColor(76, 175, 80);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text("RESOLUTION", margin, y);
          y += 5;
          doc.setTextColor(0);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(job.issuesResolution, margin, y);
        }
      }

      doc.save(`JobCard_${job.jobRef}.pdf`);
    });
  });
}

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
      {/* Header — logo + ref + status badges */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            component="img"
            src="/images/soundhublogo.png"
            alt="SoundHub Logo"
            sx={{ height: 40, objectFit: "contain" }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
              {job.jobRef}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatJobDate(job.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={job.jobStatus}
              size="small"
              sx={{
                bgcolor: `${JOB_STATUS_COLOR[job.jobStatus]}18`,
                color: JOB_STATUS_COLOR[job.jobStatus],
                fontWeight: 600,
                border: `1px solid ${JOB_STATUS_COLOR[job.jobStatus]}40`,
                px: 1,
              }}
            />
            <Chip
              label={job.paymentStatus}
              size="small"
              sx={{
                bgcolor: `${PAYMENT_STATUS_COLOR[job.paymentStatus]}18`,
                color: PAYMENT_STATUS_COLOR[job.paymentStatus],
                fontWeight: 600,
                px: 1,
              }}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        <CustomerSection job={job} />
        <ServicesSection job={job} />
        <ProductsSection job={job} />
        <PaymentSection job={job} />
        <InstallationSection job={job} />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} sx={{ mr: "auto" }}>
          Close
        </Button>
        <Button
          startIcon={<DownloadOutlined />}
          variant="outlined"
          onClick={() => job && downloadJobPdf(job)}
        >
          Download PDF
        </Button>
        <Button
          startIcon={<PrintOutlined />}
          variant="outlined"
          onClick={() => window.print()}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
