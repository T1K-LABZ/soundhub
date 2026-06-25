import { ReceiptOutlined, TrendingUpOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Invoice } from "./invoice.types";

type CardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

function SummaryCard({ label, value, icon, color }: CardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", minWidth: 130, flex: "1 1 0", display: "flex" }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          height: "100%",
          boxSizing: "border-box",
          "&:last-child": { pb: 2 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: `${color}18`,
            color,
            borderRadius: 2,
            p: 1,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" display="block">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function InvoiceSummaryBar({ invoices }: { invoices: Invoice[] }) {
  const totalItems = invoices.reduce((sum, inv) => sum + inv.lineItems.length, 0);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
      }}
    >
      <Box sx={{ display: "flex", gap: 2, minWidth: "min-content" }}>
        <SummaryCard
          label="Total Invoices"
          value={invoices.length.toString()}
          icon={<ReceiptOutlined fontSize="small" />}
          color="#2563EB"
        />
        <SummaryCard
          label="Total Items"
          value={totalItems.toString()}
          icon={<TrendingUpOutlined fontSize="small" />}
          color="#9333EA"
        />
      </Box>
    </Box>
  );
}
