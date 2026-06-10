import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import { JOBS } from "./sales.data";
import type { Job } from "./sales.types";
import { NewSaleStep1, type Step1Data } from "./NewSaleStep1";
import { NewSaleStep2, type Step2Data } from "./NewSaleStep2";
import { NewSaleStep3, type Step3Data } from "./NewSaleStep3";
import { NewSaleStep4, type Step4Data } from "./NewSaleStep4";

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  "Customer & Vehicle",
  "Service & Products",
  "Payment",
  "Installation Notes",
];

const INIT_STEP1: Step1Data = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  carPlate: "",
  carMake: "",
  carModel: "",
  carVariant: "",
  carYear: "",
};

const INIT_STEP2: Step2Data = {
  serviceType: "",
  services: [],
  products: [],
  discount: 0,
};

const INIT_STEP3: Step3Data = {
  paymentStatus: "Unpaid",
  depositAmount: "",
  paymentMethod: "Cash",
  mpesaRef: "",
  paymentDate: new Date().toISOString().slice(0, 10),
};

const INIT_STEP4: Step4Data = {
  technicianName: "",
  jobStatus: "Pending",
  installationNotes: "",
  issuesEncountered: "",
  issuesResolution: "",
  difficultyRating: "Easy",
  followUpNeeded: false,
  followUpNotes: "",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (job: Partial<Job>) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function NewSaleModal({ open, onClose, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [step1, setStep1] = useState<Step1Data>(INIT_STEP1);
  const [step2, setStep2] = useState<Step2Data>(INIT_STEP2);
  const [step3, setStep3] = useState<Step3Data>(INIT_STEP3);
  const [step4, setStep4] = useState<Step4Data>(INIT_STEP4);

  function handleClose() {
    // Reset form on close
    setStep(0);
    setStep1(INIT_STEP1);
    setStep2(INIT_STEP2);
    setStep3(INIT_STEP3);
    setStep4(INIT_STEP4);
    onClose();
  }

  const productsSubtotal = step2.products.reduce((s, p) => s + p.lineTotal, 0);
  const servicesSubtotal = step2.services.reduce(
    (s, svc) => s + svc.basePrice,
    0,
  );
  const grandTotal = Math.max(
    0,
    productsSubtotal + servicesSubtotal - step2.discount,
  );

  function buildJob(): Partial<Job> {
    const depositNum = Number(step3.depositAmount) || 0;
    return {
      jobRef: `JOB-${String(JOBS.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      customerName: step1.customerName,
      customerPhone: step1.customerPhone,
      customerEmail: step1.customerEmail || undefined,
      carPlate: step1.carPlate,
      carMake: step1.carMake,
      carModel: step1.carModel,
      carVariant: step1.carVariant,
      carYear: Number(step1.carYear),
      serviceType: step2.serviceType as Job["serviceType"],
      services: step2.services,
      products: step2.products,
      productsSubtotal,
      servicesSubtotal,
      discount: step2.discount,
      grandTotal,
      paymentStatus: step3.paymentStatus,
      depositAmount:
        step3.paymentStatus === "Deposit Made" ? depositNum : undefined,
      balanceRemaining:
        step3.paymentStatus === "Deposit Made"
          ? Math.max(0, grandTotal - depositNum)
          : undefined,
      paymentMethod: step3.paymentMethod,
      mpesaRef: step3.mpesaRef || undefined,
      paymentDate: step3.paymentDate,
      technicianName: step4.technicianName,
      jobStatus: step4.jobStatus,
      installationNotes: step4.installationNotes,
      issuesEncountered: step4.issuesEncountered || undefined,
      issuesResolution: step4.issuesResolution || undefined,
      difficultyRating: step4.difficultyRating,
      followUpNeeded: step4.followUpNeeded,
      followUpNotes: step4.followUpNotes || undefined,
    };
  }

  function handleSave(andPrint = false) {
    const job = buildJob();
    onSave?.(job);
    if (andPrint) window.print();
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>New Sale / Job</DialogTitle>

      <DialogContent dividers>
        {/* Stepper nav */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        {step === 0 && (
          <NewSaleStep1 data={step1} onChange={setStep1} existingJobs={JOBS} />
        )}
        {step === 1 && <NewSaleStep2 data={step2} onChange={setStep2} />}
        {step === 2 && (
          <NewSaleStep3
            data={step3}
            grandTotal={grandTotal}
            onChange={setStep3}
          />
        )}
        {step === 3 && <NewSaleStep4 data={step4} onChange={setStep4} />}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} sx={{ mr: "auto" }}>
          Cancel
        </Button>

        {step > 0 && (
          <Button variant="outlined" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}

        {step < STEPS.length - 1 ? (
          <Button variant="contained" onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => handleSave(false)}>
              Save Job
            </Button>
            <Button variant="contained" onClick={() => handleSave(true)}>
              Save &amp; Print
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
