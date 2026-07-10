import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useCreateJob, useUpdateJob } from "./sales.api";
import type { Job } from "./sales.types";
import { NewSaleStep1, type Step1Data } from "./NewSaleStep1";
import { NewSaleStep2, type Step2Data } from "./NewSaleStep2";
import { NewSaleStep3, type Step3Data } from "./NewSaleStep3";
import { NewSaleStep4, type Step4Data } from "./NewSaleStep4";
import type { StepErrors } from "./sales.types";

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

function jobToStep1(job: Job): Step1Data {
  return {
    customerName: job.customerName,
    customerPhone: job.customerPhone,
    customerEmail: job.customerEmail || "",
    carPlate: job.carPlate,
    carMake: job.carMake,
    carModel: job.carModel,
    carVariant: job.carVariant,
    carYear: String(job.carYear),
  };
}

function jobToStep2(job: Job): Step2Data {
  return {
    serviceType: job.serviceType,
    services: job.services,
    products: job.products,
    discount: job.discount,
  };
}

function jobToStep3(job: Job): Step3Data {
  return {
    paymentStatus: job.paymentStatus,
    depositAmount: job.depositAmount ? String(job.depositAmount) : "",
    paymentMethod: job.paymentMethod,
    mpesaRef: job.mpesaRef || "",
    paymentDate: job.paymentDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  };
}

function jobToStep4(job: Job): Step4Data {
  return {
    technicianName: job.technicianName,
    jobStatus: job.jobStatus,
    installationNotes: job.installationNotes,
    issuesEncountered: job.issuesEncountered || "",
    issuesResolution: job.issuesResolution || "",
    difficultyRating: job.difficultyRating,
    followUpNeeded: job.followUpNeeded,
    followUpNotes: job.followUpNotes || "",
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  job?: Job | null;
  initialStep?: number;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function NewSaleModal({ open, onClose, job, initialStep = 0 }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const isEditing = !!job;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [step, setStep] = useState(0);
  const [step1, setStep1] = useState<Step1Data>(INIT_STEP1);
  const [step2, setStep2] = useState<Step2Data>(INIT_STEP2);
  const [step3, setStep3] = useState<Step3Data>(INIT_STEP3);
  const [step4, setStep4] = useState<Step4Data>(INIT_STEP4);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [triedToContinue, setTriedToContinue] = useState(false);

  useEffect(() => {
    if (job) {
      setStep1(jobToStep1(job));
      setStep2(jobToStep2(job));
      setStep3(jobToStep3(job));
      setStep4(jobToStep4(job));
    } else {
      setStep1(INIT_STEP1);
      setStep2(INIT_STEP2);
      setStep3(INIT_STEP3);
      setStep4(INIT_STEP4);
    }
    setStep(initialStep ?? 0);
    setStepErrors({});
    setTriedToContinue(false);
  }, [job, open, initialStep]);

  const validateStep = useCallback((s: number): boolean => {
    const errors: StepErrors = {};
    if (s === 0) {
      if (!step1.customerName.trim()) errors.customerName = "Customer name is required";
      if (!step1.customerPhone.trim()) errors.customerPhone = "Phone number is required";
      if (!step1.carPlate.trim()) errors.carPlate = "Car plate is required";
      if (!step1.carMake.trim()) errors.carMake = "Car make is required";
      if (!step1.carModel.trim()) errors.carModel = "Car model is required";
      if (!step1.carYear.trim()) errors.carYear = "Car year is required";
    } else if (s === 1) {
      if (!step2.serviceType) errors.serviceType = "Service type is required";
    } else if (s === 3) {
      if (!step4.technicianName.trim()) errors.technicianName = "Technician is required";
      if (!step4.jobStatus.trim()) errors.jobStatus = "Job status is required";
      if (!step4.installationNotes.trim()) errors.installationNotes = "Installation notes are required";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }, [step1, step2, step4]);

  function handleContinue() {
    setTriedToContinue(true);
    if (validateStep(step)) {
      setStep((s) => s + 1);
      setStepErrors({});
      setTriedToContinue(false);
    }
  }

  function handleClose() {
    setStep(0);
    setStep1(INIT_STEP1);
    setStep2(INIT_STEP2);
    setStep3(INIT_STEP3);
    setStep4(INIT_STEP4);
    setStepErrors({});
    setTriedToContinue(false);
    onClose();
  }

  const productsSubtotal = step2.products.reduce((s, p) => s + Number(p.lineTotal), 0);
  const servicesSubtotal = step2.services.reduce(
    (s, svc) => s + Number(svc.basePrice),
    0,
  );
  const discount = Number(step2.discount) || 0;
  const grandTotal = Math.max(
    0,
    productsSubtotal + servicesSubtotal - discount,
  );

  function buildPayload() {
    const depositNum = Number(step3.depositAmount) || 0;
    return {
      storeId,
      customerName: step1.customerName,
      customerPhone: step1.customerPhone,
      customerEmail: step1.customerEmail || undefined,
      carPlate: step1.carPlate,
      carMake: step1.carMake,
      carModel: step1.carModel,
      carVariant: step1.carVariant,
      carYear: Number(step1.carYear),
      serviceType: step2.serviceType,
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
    const payload = buildPayload();
    const onSuccess = () => {
      if (andPrint) window.print();
      handleClose();
    };

    if (isEditing && job) {
      updateJob.mutate({ jobId: job.id, payload }, { onSuccess });
    } else {
      createJob.mutate(payload, { onSuccess });
    }
  }

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(31, 41, 51, 0.02)",
        }}
      >
        <Typography variant="h6" component="div" fontWeight={800}>
          {isEditing ? "Edit Sale / Job" : "New Sale / Job"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((step + 1) / STEPS.length) * 100}
          sx={{ mt: 1.5, height: 6, borderRadius: 3, display: { xs: "block", sm: "none" } }}
        />
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 3, sm: 3 },
          bgcolor: "#FFFFFF",
        }}
      >
        <Stepper
          activeStep={step}
          alternativeLabel
          sx={{
            mb: 3,
            display: { xs: "none", sm: "flex" },
            "& .MuiStepLabel-label": { fontWeight: 700 },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <NewSaleStep1
            data={step1}
            onChange={setStep1}
            errors={stepErrors}
            triedToContinue={triedToContinue}
          />
        )}
        {step === 1 && (
          <NewSaleStep2
            data={step2}
            onChange={setStep2}
            errors={stepErrors}
            triedToContinue={triedToContinue}
          />
        )}
        {step === 2 && (
          <NewSaleStep3
            data={step3}
            grandTotal={grandTotal}
            onChange={setStep3}
          />
        )}
        {step === 3 && (
          <NewSaleStep4
            data={step4}
            onChange={setStep4}
            errors={stepErrors}
            triedToContinue={triedToContinue}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          boxShadow: { xs: "0 -12px 28px rgba(31, 41, 51, 0.08)", sm: "none" },
          display: "block",
        }}
      >
        <Box
          sx={{
            display: { xs: "grid", sm: "flex" },
            gridTemplateColumns: "1fr",
            gap: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          {step < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleContinue}
              fullWidth
              sx={{
                minHeight: 46,
                fontWeight: 800,
                order: { xs: 1, sm: 3 },
                width: { sm: "auto" },
                px: { sm: 3 },
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => handleSave(true)}
              disabled={isPending}
              fullWidth
              sx={{
                minHeight: 46,
                fontWeight: 800,
                order: { xs: 1, sm: 4 },
                width: { sm: "auto" },
                px: { sm: 3 },
              }}
            >
              {isEditing ? "Update & Print" : "Save & Print"}
            </Button>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: step > 0 ? "1fr 1fr" : "1fr",
              gap: 1,
              order: { xs: 2, sm: 1 },
              mr: { sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              onClick={handleClose}
              variant="text"
              color="inherit"
              sx={{ minHeight: 40, color: "text.secondary", fontWeight: 700 }}
            >
              Cancel
            </Button>

            {step > 0 && (
              <Button
                variant="outlined"
                onClick={() => setStep((s) => s - 1)}
                sx={{ minHeight: 40, fontWeight: 700 }}
              >
                Back
              </Button>
            )}
          </Box>

          {step === STEPS.length - 1 && (
            <Button
              variant="outlined"
              onClick={() => handleSave(false)}
              disabled={isPending}
              fullWidth
              sx={{
                minHeight: 42,
                fontWeight: 700,
                order: { xs: 3, sm: 3 },
                width: { sm: "auto" },
              }}
            >
              {isEditing ? "Update Only" : "Save Only"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
