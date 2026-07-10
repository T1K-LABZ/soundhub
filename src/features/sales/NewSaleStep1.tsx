import {
  CheckCircleOutlined,
  DirectionsCarOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useCustomerLookupQuery } from "./sales.api";
import type { CustomerCar, StepErrors } from "./sales.types";

export type Step1Data = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carPlate: string;
  carMake: string;
  carModel: string;
  carVariant: string;
  carYear: string;
};

const CAR_MAKES_FORM = [
  "Toyota",
  "VW",
  "BMW",
  "Mercedes",
  "Subaru",
  "Nissan",
  "Mazda",
  "Ford",
  "Hyundai",
  "Honda",
  "Mitsubishi",
];

type Props = {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  errors?: StepErrors;
  triedToContinue?: boolean;
};

export function NewSaleStep1({ data, onChange, errors = {}, triedToContinue = false }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";

  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [selectedCarPlate, setSelectedCarPlate] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPhone(data.customerPhone), 500);
    return () => clearTimeout(timer);
  }, [data.customerPhone]);

  const { data: customer, isFetching: customerLoading } =
    useCustomerLookupQuery(storeId, debouncedPhone);

  const debouncedClean = debouncedPhone.replace(/\s/g, "");
  const isCustomerFound = !!customer && debouncedClean.length >= 10;

  useEffect(() => {
    if (customer && debouncedClean.length >= 10) {
      const changed: Partial<Step1Data> = {};
      if (!data.customerName || data.customerName !== customer.name) {
        changed.customerName = customer.name;
      }
      const email = customer.email || "";
      if (email && (!data.customerEmail || data.customerEmail !== email)) {
        changed.customerEmail = email;
      }
      if (Object.keys(changed).length > 0) {
        onChange({ ...data, ...changed });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, debouncedPhone]);

  function set(key: keyof Step1Data, value: string) {
    if (key === "carPlate" && value.toUpperCase() !== data.carPlate && selectedCarPlate) {
      setSelectedCarPlate(null);
    }
    onChange({ ...data, [key]: value });
  }

  function selectCar(car: CustomerCar) {
    setSelectedCarPlate(car.plate);
    onChange({
      ...data,
      carPlate: car.plate,
      carMake: car.make,
      carModel: car.model,
      carVariant: car.variant || "",
      carYear: String(car.year),
    });
  }

  function fieldError(key: keyof StepErrors): string | undefined {
    return triedToContinue ? errors[key] : undefined;
  }

  const phoneClean = data.customerPhone.replace(/\s/g, "");

  return (
    <Grid container spacing={2} mt={1}>
      {/* Customer info */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Customer Name"
          fullWidth
          size="small"
          value={data.customerName}
          onChange={(e) => set("customerName", e.target.value)}
          required
          error={!!fieldError("customerName")}
          helperText={fieldError("customerName")}
          slotProps={{
            input: isCustomerFound ? {
              endAdornment: (
                <InputAdornment position="end">
                  <CheckCircleOutlined fontSize="small" color="success" />
                </InputAdornment>
              ),
            } : undefined,
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Phone"
          fullWidth
          size="small"
          value={data.customerPhone}
          onChange={(e) => set("customerPhone", e.target.value)}
          required
          placeholder="0712 345 678"
          error={!!fieldError("customerPhone")}
          helperText={fieldError("customerPhone") || (customerLoading ? "Looking up customer..." : undefined)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: customerLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : isCustomerFound ? (
                <InputAdornment position="end">
                  <CheckCircleOutlined fontSize="small" color="success" />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Email (optional)"
          fullWidth
          size="small"
          type="email"
          value={data.customerEmail}
          onChange={(e) => set("customerEmail", e.target.value)}
        />
      </Grid>

      {isCustomerFound && customer.cars.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 0.75, display: "block" }}>
            Select existing car for this job
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {customer.cars.map((car, idx) => (
              <Chip
                key={idx}
                label={`${car.plate}  •  ${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}`}
                variant={selectedCarPlate === car.plate ? "filled" : "outlined"}
                color={selectedCarPlate === car.plate ? "primary" : "default"}
                onClick={() => selectCar(car)}
                icon={<DirectionsCarOutlined />}
                sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
              />
            ))}
          </Box>
          {selectedCarPlate && (
            <Typography variant="caption" color="text.secondary" fontStyle="italic" sx={{ mt: 0.5, display: "block" }}>
              Change the plate above to register a new car for this customer
            </Typography>
          )}
        </Grid>
      )}

      {phoneClean.length >= 10 && !customerLoading && !customer && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary" fontStyle="italic">
            New customer — fill in details below
          </Typography>
        </Grid>
      )}

      {/* Car details */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Car Plate"
          fullWidth
          size="small"
          value={data.carPlate}
          onChange={(e) => set("carPlate", e.target.value.toUpperCase())}
          required
          placeholder="KDA 123A"
          error={!!fieldError("carPlate")}
          helperText={fieldError("carPlate")}
          slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          select
          label="Car Make"
          fullWidth
          size="small"
          value={data.carMake}
          onChange={(e) => set("carMake", e.target.value)}
          required
          error={!!fieldError("carMake")}
          helperText={fieldError("carMake")}
        >
          {CAR_MAKES_FORM.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Model"
          fullWidth
          size="small"
          value={data.carModel}
          onChange={(e) => set("carModel", e.target.value)}
          required
          placeholder="Prado"
          error={!!fieldError("carModel")}
          helperText={fieldError("carModel")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Variant"
          fullWidth
          size="small"
          value={data.carVariant}
          onChange={(e) => set("carVariant", e.target.value)}
          placeholder="J150 TX"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Year"
          fullWidth
          size="small"
          type="number"
          value={data.carYear}
          onChange={(e) => set("carYear", e.target.value)}
          required
          placeholder="2021"
          error={!!fieldError("carYear")}
          helperText={fieldError("carYear")}
          slotProps={{ htmlInput: { min: 1990, max: 2030 } }}
        />
      </Grid>
    </Grid>
  );
}
