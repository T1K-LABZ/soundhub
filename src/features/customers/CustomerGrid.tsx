import { Box, Grid, Typography } from "@mui/material";
import { CustomerCard } from "./CustomerCard";
import type { Customer } from "./customers.types";

type Props = {
  customers: Customer[];
  onView: (c: Customer) => void;
  onSendOffer: (c: Customer) => void;
  onEdit: (c: Customer) => void;
};

export function CustomerGrid({
  customers,
  onView,
  onSendOffer,
  onEdit,
}: Props) {
  if (customers.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No customers match your filters
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {customers.map((c) => (
        <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <CustomerCard
            customer={c}
            onView={() => onView(c)}
            onSendOffer={() => onSendOffer(c)}
            onEdit={() => onEdit(c)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
