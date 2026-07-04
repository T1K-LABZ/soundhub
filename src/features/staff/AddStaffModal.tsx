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
import { useAuthStore } from "../auth/auth.store";
import {
  createStaff,
  getAssignableRoles,
  getUserStores,
} from "./staff.api";
import { AddStaffStep1 } from "./AddStaffStep1";
import { AddStaffStep2 } from "./AddStaffStep2";
import { AddStaffStep3 } from "./AddStaffStep3";
import type {
  AddStaffForm,
  AssignableRole,
  StaffMember,
  UserStore,
} from "./staff.types";

type Props = {
  open: boolean;
  editing: StaffMember | null;
  onClose: () => void;
  onSaved: (phone?: string) => void;
};

const STEPS = ["Personal Info", "Job Info", "System Access"];

function buildEmpty(): AddStaffForm {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    nationalId: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    role: "",
    customRoleId: "",
    employmentType: "Full Time",
    specializations: [],
    dateJoined: new Date().toISOString().split("T")[0],
    salaryRate: 0,
    notes: "",
    status: "Active",
    password: "",
  };
}

function fromStaffMember(s: StaffMember): AddStaffForm {
  const parts = s.fullName.split(" ");
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    phone: s.phone,
    email: s.email,
    nationalId: s.nationalId,
    dateOfBirth: s.dateOfBirth,
    emergencyContactName: s.emergencyContactName,
    emergencyContactPhone: s.emergencyContactPhone,
    role: s.role,
    customRoleId: "",
    employmentType: s.employmentType,
    specializations: [...s.specializations],
    dateJoined: s.dateJoined,
    salaryRate: s.salaryRate ?? 0,
    notes: s.notes ?? "",
    status: s.status,
    password: "",
  };
}

export function AddStaffModal({ editing, onClose, onSaved, open }: Props) {
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AddStaffForm>(buildEmpty());
  const [stores, setStores] = useState<UserStore[]>([]);
  const [roles, setRoles] = useState<AssignableRole[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStoreId = user?.storeId ?? "";

  useEffect(() => {
    if (!open || !user?.id) return;
    setLoadingStores(true);
    getUserStores(user.id)
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoadingStores(false));
  }, [open, user?.id]);

  useEffect(() => {
    if (!open || !selectedStoreId) return;
    setLoadingRoles(true);
    getAssignableRoles(selectedStoreId)
      .then(setRoles)
      .catch(() => {})
      .finally(() => setLoadingRoles(false));
  }, [open, selectedStoreId]);

  useEffect(() => {
    if (open) {
      setForm(editing ? fromStaffMember(editing) : buildEmpty());
      setStep(0);
      setError(null);
    }
  }, [open, editing]);

  function handleChange<K extends keyof AddStaffForm>(
    k: K,
    v: AddStaffForm[K],
  ) {
    setForm((prev) => {
      const updated = { ...prev, [k]: v };
      if (k === "role") {
        const matched = roles.find((r) => r.name === v);
        updated.customRoleId = matched?.id ?? "";
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

  async function handleSave() {
    if (!selectedStoreId || !form.customRoleId) return;
    setSubmitting(true);
    setError(null);
    try {
      await createStaff({
        storeId: selectedStoreId,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        email: form.email,
        password: form.password,
        customRoleId: form.customRoleId,
        nationalId: form.nationalId,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : "",
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        employmentType: form.employmentType,
        specializations: form.specializations,
        dateJoined: form.dateJoined
          ? new Date(form.dateJoined).toISOString()
          : "",
        salaryRate: form.salaryRate,
        notes: form.notes,
        status: form.status,
      });
      onSaved(editing ? undefined : form.phone);
      onClose();
    } catch {
      setError("Failed to create staff member. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const step1Valid = form.firstName.trim() !== "" && form.lastName.trim() !== "" && form.phone.trim() !== "";
  const step2Valid = form.customRoleId !== "" && form.dateJoined !== "";
  const step3Valid = form.password.trim() !== "";

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

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ pt: 0.5 }}>
          {step === 0 && <AddStaffStep1 form={form} onChange={handleChange} />}
          {step === 1 && (
            <AddStaffStep2
              form={form}
              onChange={handleChange}
              roles={roles}
              loadingRoles={loadingRoles}
            />
          )}
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
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!stepValid || submitting}
          >
            {submitting ? "Saving…" : "Save Staff"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
