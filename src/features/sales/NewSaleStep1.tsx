import { Grid, MenuItem, TextField } from "@mui/material";

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
};

export function NewSaleStep1({ data, onChange }: Props) {
  function set(key: keyof Step1Data, value: string) {
    onChange({ ...data, [key]: value });
  }

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

      {/* Plate field */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Car Plate"
          fullWidth
          size="small"
          value={data.carPlate}
          onChange={(e) => set("carPlate", e.target.value.toUpperCase())}
          required
          placeholder="KDA 123A"
          inputProps={{ style: { textTransform: "uppercase" } }}
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
          inputProps={{ min: 1990, max: 2030 }}
        />
      </Grid>
    </Grid>
  );
}
