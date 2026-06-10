import {
  Inventory2Outlined,
  ReportProblemOutlined,
  TrendingUpOutlined,
  WarehouseOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import type { InventorySummary } from "./inventory.types";
import { formatKsh } from "./inventory.utils";

type Props = {
  summary: InventorySummary;
  onLowStockClick: () => void;
  onOutOfStockClick: () => void;
};

type SummaryCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  clickable?: boolean;
  onClick?: () => void;
};

function SummaryCard({
  label,
  value,
  sub,
  icon,
  color,
  clickable,
  onClick,
}: SummaryCardProps) {
  const content = (
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        height: "100%",
        boxSizing: "border-box",
        "&:last-child": { pb: 2 },
      }}
    >
      {/* Icon badge — fixed size so all cards align */}
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

      {/* Text block — fills remaining space, truncates long values */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Tooltip title={value} disableHoverListener={value.length < 20}>
          <Typography
            variant="h6"
            fontWeight={700}
            noWrap
            sx={{ lineHeight: 1.3 }}
          >
            {value}
          </Typography>
        </Tooltip>
        {sub && (
          <Typography variant="caption" color="text.secondary" display="block">
            {sub}
          </Typography>
        )}
      </Box>
    </CardContent>
  );

  return (
    // height: 100% ensures all cards in the same Grid row stretch to the tallest one
    <Card variant="outlined" sx={{ height: "100%" }}>
      {clickable ? (
        <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}

export function InventorySummaryBar({
  summary,
  onLowStockClick,
  onOutOfStockClick,
}: Props) {
  return (
    // alignItems="stretch" makes every Grid cell the same height as the tallest
    <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Total Cost Value"
          value={formatKsh(summary.totalCostValue)}
          sub={`Retail: ${formatKsh(summary.totalRetailValue)}`}
          icon={<TrendingUpOutlined />}
          color="#9333EA"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Total Products in Stock"
          value={summary.totalProducts.toString()}
          icon={<WarehouseOutlined />}
          color="#2563EB"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Low Stock"
          value={summary.lowStockCount.toString()}
          sub="Click to filter"
          icon={<ReportProblemOutlined />}
          color="#D97706"
          clickable
          onClick={onLowStockClick}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Out of Stock"
          value={summary.outOfStockCount.toString()}
          sub="Click to filter"
          icon={<Inventory2Outlined />}
          color="#DC2626"
          clickable
          onClick={onOutOfStockClick}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: "auto" }} sx={{ flex: 1 }}>
        <SummaryCard
          label="Most Moved (Month)"
          value={summary.mostMovedProduct}
          icon={<TrendingUpOutlined />}
          color="#16A34A"
        />
      </Grid>
    </Grid>
  );
}
