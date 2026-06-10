import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { KpiCard } from "./reports.types";

type Props = {
  kpis: KpiCard[];
  showComparison: boolean;
};

function KpiCardItem({
  card,
  showComparison,
}: {
  card: KpiCard;
  showComparison: boolean;
}) {
  const hasChange = showComparison && card.change !== undefined;
  const isUp = (card.change ?? 0) >= 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: card.alert ? "1.5px solid #DC2626" : "1px solid",
        borderColor: card.alert ? "#DC2626" : "divider",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Icon circle */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: card.color + "22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {card.icon}
          </Box>

          {/* % change badge */}
          {hasChange && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                fontSize: 12,
                fontWeight: 600,
                color: isUp ? "#16A34A" : "#DC2626",
                bgcolor: isUp ? "#dcfce7" : "#fee2e2",
                borderRadius: 1,
                px: 0.8,
                py: 0.3,
              }}
            >
              {isUp ? (
                <ArrowUpwardIcon sx={{ fontSize: 13 }} />
              ) : (
                <ArrowDownwardIcon sx={{ fontSize: 13 }} />
              )}
              {Math.abs(card.change!).toFixed(1)}%
            </Box>
          )}
        </Box>

        {/* Value */}
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 1.5, color: card.alert ? "#DC2626" : "text.primary" }}
        >
          {card.value}
        </Typography>

        {/* Label */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
          {card.label}
        </Typography>

        {/* Sub-value */}
        {card.subValue && (
          <Typography variant="caption" color="text.disabled">
            {card.subValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function ReportsKpiCards({ kpis, showComparison }: Props) {
  const row1 = kpis.slice(0, 4);
  const row2 = kpis.slice(4, 8);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {row1.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <KpiCardItem card={card} showComparison={showComparison} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {row2.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <KpiCardItem card={card} showComparison={showComparison} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
