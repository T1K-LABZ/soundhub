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
import { useEffect, useState } from "react";
import { AddCustomerStep1 } from "./AddCustomerStep1";
import { AddCustomerStep2 } from "./AddCustomerStep2";
import type { AddCustomerForm, Customer } from "./customers.types";

type Props = {
  open: boolean;
  editing: Customer | null;
  onClose: () => void;
  onSave: (form: AddCustomerForm) => void;
};

const STEPS = ["Personal Info", "Vehicle Info"];

function buildEmpty(): AddCustomerForm {
  return {
    fullName: "",
    phone: "",
    email: "",
    location: "Westlands",
    birthday: "",
    contactPreference: "Whatsapp",
    optedInToPromos: true,
    notes: "",
    vehicles: [],
  };
}

function fromCustomer(c: Customer): AddCustomerForm {
  return {
    fullName: c.fullName,
    phone: c.phone,
    email: c.email ?? "",
    location: c.location,
    birthday: c.birthday ?? "",
    contactPreference: c.contactPreference,
    optedInToPromos: c.optedInToPromos,
    notes: c.notes ?? "",
    vehicles: c.vehicles.map((v) => ({ localId: v.id, ...v })),
  };
}

export function AddCustomerModal({ open, editing, onClose, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AddCustomerForm>(buildEmpty());

  useEffect(() => {
    if (open) {
      setForm(editing ? fromCustomer(editing) : buildEmpty());
      setStep(0);
    }
  }, [open, editing]);

  function handleChange<K extends keyof AddCustomerForm>(
    k: K,
    v: AddCustomerForm[K],
  ) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleSave() {
    onSave(form);
    onClose();
  }

  const step1Valid = form.fullName.trim() !== "" && form.phone.trim() !== "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
    >
      <DialogTitle>
        {editing ? `Edit — ${editing.fullName}` : "Add New Customer"}
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
          {step === 0 && (
            <AddCustomerStep1 form={form} onChange={handleChange} />
          )}
          {step === 1 && (
            <AddCustomerStep2 form={form} onChange={handleChange} />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ mr: "auto" }}>
          Cancel
        </Button>
        {step > 0 && (
          <Button onClick={() => setStep((s) => s - 1)}>Back</Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setStep((s) => s + 1)}
            disabled={!step1Valid}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!step1Valid}
          >
            Save Customer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
