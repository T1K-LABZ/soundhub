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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DEFAULT_PERMISSIONS } from "./staff.constants";
import { AddStaffStep1 } from "./AddStaffStep1";
import { AddStaffStep2 } from "./AddStaffStep2";
import { AddStaffStep3 } from "./AddStaffStep3";
import type { AddStaffForm, StaffMember } from "./staff.types";

type Props = {
  open: boolean;
  editing: StaffMember | null; // null = add mode
  onClose: () => void;
  onSave: (form: AddStaffForm) => void;
};

const STEPS = ["Personal Info", "Job Info", "System Access"];

function buildEmpty(): AddStaffForm {
  return {
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    role: "Junior Technician",
    employmentType: "Full Time",
    specializations: [],
    dateJoined: new Date().toISOString().split("T")[0],
    salaryRate: 0,
    notes: "",
    status: "Active",
    username: "",
    tempPassword: "",
    permissions: DEFAULT_PERMISSIONS["Junior Technician"],
  };
}

function fromStaffMember(s: StaffMember): AddStaffForm {
  return {
    fullName: s.fullName,
    phone: s.phone,
    email: s.email,
    nationalId: s.nationalId,
    dateOfBirth: s.dateOfBirth,
    emergencyContactName: s.emergencyContactName,
    emergencyContactPhone: s.emergencyContactPhone,
    role: s.role,
    employmentType: s.employmentType,
    specializations: [...s.specializations],
    dateJoined: s.dateJoined,
    salaryRate: s.salaryRate ?? 0,
    notes: s.notes ?? "",
    status: s.status,
    username: s.username,
    tempPassword: "",
    permissions: DEFAULT_PERMISSIONS[s.role],
  };
}

export function AddStaffModal({ open, editing, onClose, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AddStaffForm>(buildEmpty());

  // When modal opens, seed form from editing staff or blank
  useEffect(() => {
    if (open) {
      setForm(editing ? fromStaffMember(editing) : buildEmpty());
      setStep(0);
    }
  }, [open, editing]);

  // When role changes on step 2, auto-fill suggested permissions
  function handleChange<K extends keyof AddStaffForm>(
    k: K,
    v: AddStaffForm[K],
  ) {
    setForm((prev) => {
      const updated = { ...prev, [k]: v };
      if (k === "role") {
        updated.permissions = DEFAULT_PERMISSIONS[v as AddStaffForm["role"]];
        // Auto-suggest username from name if not already set
        if (!prev.username && k === "fullName") {
          updated.username = (v as string).toLowerCase().replace(/\s+/g, ".");
        }
      }
      if (k === "fullName" && !prev.username) {
        updated.username = (v as string).toLowerCase().replace(/\s+/g, ".");
      }
      return updated;
    });
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleSave() {
    onSave(form);
    onClose();
  }

  const step1Valid = form.fullName.trim() !== "" && form.phone.trim() !== "";
  const step2Valid = form.role !== "" && form.dateJoined !== "";
  const step3Valid = form.username.trim() !== "";

  const stepValid = [step1Valid, step2Valid, step3Valid][step];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        {editing ? `Edit Staff — ${editing.fullName}` : "Add New Staff Member"}
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ pt: 0.5 }}>
          {step === 0 && <AddStaffStep1 form={form} onChange={handleChange} />}
          {step === 1 && <AddStaffStep2 form={form} onChange={handleChange} />}
          {step === 2 && <AddStaffStep3 form={form} onChange={handleChange} />}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ mr: "auto" }}>
          Cancel
        </Button>
        {step > 0 && <Button onClick={handleBack}>Back</Button>}
        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!stepValid}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleSave}
              disabled={!step3Valid}
            >
              Save Staff
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!step3Valid}
            >
              Save &amp; Activate
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
