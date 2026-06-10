import { Box, Paper, Typography } from "@mui/material";
import type { InsightProduct } from "./inventory.types";

type Props = {
  fastest: InsightProduct;
  slowest: InsightProduct;
};

type InsightCardProps = {
  emoji: string;
  label: string;
  product: InsightProduct;
  accentColor: string;
};

function InsightCard({ emoji, label, product, accentColor }: InsightCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        flex: "1 1 240px",
        borderLeft: `4px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {emoji} {label}
      </Typography>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        {product.productName || "—"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {product.brand || "—"} &bull; <strong>{product.unitsMoved}</strong>{" "}
        units moved this month
      </Typography>
    </Paper>
  );
}

export function InventoryInsightCards({ fastest, slowest }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
      <InsightCard
        emoji="🔥"
        label="Fastest Moving Product"
        product={fastest}
        accentColor="#f59e0b"
      />
      <InsightCard
        emoji="🐌"
        label="Slowest Moving Product"
        product={slowest}
        accentColor="#94a3b8"
      />
    </Box>
  );
}
