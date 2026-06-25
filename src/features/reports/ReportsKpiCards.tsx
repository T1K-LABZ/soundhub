import { Box, Card, CardContent, Typography } from "@mui/material";
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
      variant="outlined"
      sx={{
        height: "100%",
        minWidth: 150,
        flex: "1 1 0",
        display: "flex",
        borderRadius: 2,
        border: card.alert ? "1.5px solid #DC2626" : "1px solid",
        borderColor: card.alert ? "#DC2626" : "divider",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: card.color + "22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {card.icon}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" display="block" noWrap>
              {card.label}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {card.value}
            </Typography>
          </Box>
        </Box>

        {hasChange && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.3,
              fontSize: 11,
              fontWeight: 600,
              color: isUp ? "#16A34A" : "#DC2626",
              bgcolor: isUp ? "#dcfce7" : "#fee2e2",
              borderRadius: 1,
              px: 0.8,
              py: 0.3,
              mt: 1,
            }}
          >
            {isUp ? (
              <ArrowUpwardIcon sx={{ fontSize: 12 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 12 }} />
            )}
            {Math.abs(card.change!).toFixed(1)}%
          </Box>
        )}

        {card.subValue && (
          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
            {card.subValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function ReportsKpiCards({ kpis, showComparison }: Props) {
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
        {kpis.map((card) => (
          <KpiCardItem key={card.label} card={card} showComparison={showComparison} />
        ))}
      </Box>
    </Box>
  );
}
