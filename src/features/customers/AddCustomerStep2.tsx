import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CAR_MAKES } from "./customers.constants";
import type { AddCustomerForm, VehicleFormEntry } from "./customers.types";

type Props = {
  form: AddCustomerForm;
  onChange: <K extends keyof AddCustomerForm>(
    k: K,
    v: AddCustomerForm[K],
  ) => void;
};

function emptyVehicle(): VehicleFormEntry {
  return {
    localId: crypto.randomUUID(),
    plate: "",
    make: "Toyota",
    model: "",
    variant: "",
    year: new Date().getFullYear(),
  };
}

export function AddCustomerStep2({ form, onChange }: Props) {
  function updateVehicle(
    localId: string,
    field: keyof VehicleFormEntry,
    value: string | number,
  ) {
    onChange(
      "vehicles",
      form.vehicles.map((v) =>
        v.localId === localId ? { ...v, [field]: value } : v,
      ),
    );
  }

  function addVehicle() {
    onChange("vehicles", [...form.vehicles, emptyVehicle()]);
  }

  function removeVehicle(localId: string) {
    onChange(
      "vehicles",
      form.vehicles.filter((v) => v.localId !== localId),
    );
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Vehicle history from past jobs will be pulled automatically once
        connected to the API.
      </Alert>

      {form.vehicles.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No vehicles added yet. Click "Add Vehicle" below.
        </Typography>
      )}

      {form.vehicles.map((v, idx) => (
        <Box key={v.localId}>
          {idx > 0 && <Divider sx={{ my: 2 }} />}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              VEHICLE {idx + 1}
            </Typography>
            <Tooltip title="Remove vehicle">
              <IconButton
                size="small"
                color="error"
                onClick={() => removeVehicle(v.localId)}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Plate Number"
                value={v.plate}
                onChange={(e) =>
                  updateVehicle(
                    v.localId,
                    "plate",
                    e.target.value.toUpperCase(),
                  )
                }
                fullWidth
                required
                placeholder="e.g. KDA 123A"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Car Make"
                value={v.make}
                onChange={(e) =>
                  updateVehicle(v.localId, "make", e.target.value)
                }
                fullWidth
              >
                {CAR_MAKES.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Model"
                value={v.model}
                onChange={(e) =>
                  updateVehicle(v.localId, "model", e.target.value)
                }
                fullWidth
                placeholder="e.g. Prado"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Variant"
                value={v.variant}
                onChange={(e) =>
                  updateVehicle(v.localId, "variant", e.target.value)
                }
                fullWidth
                placeholder="e.g. J150, GTI, TDI"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Year"
                type="number"
                value={v.year || ""}
                onChange={(e) =>
                  updateVehicle(v.localId, "year", Number(e.target.value))
                }
                fullWidth
                slotProps={{
                  htmlInput: { min: 1990, max: new Date().getFullYear() + 1 },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Color (optional)"
                value={v.color ?? ""}
                onChange={(e) =>
                  updateVehicle(v.localId, "color", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        startIcon={<AddOutlined />}
        onClick={addVehicle}
        sx={{ mt: 2 }}
        variant="outlined"
        size="small"
      >
        Add Vehicle
      </Button>
    </Box>
  );
}
