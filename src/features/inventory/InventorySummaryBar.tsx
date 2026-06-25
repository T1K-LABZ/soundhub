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
        gap: 1.5,
        p: 1.5,
        height: "100%",
        boxSizing: "border-box",
        "&:last-child": { pb: 1.5 },
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}18`,
          color,
          borderRadius: 1.5,
          p: 0.75,
          display: "flex",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
        <Typography variant="caption" color="text.secondary" display="block" noWrap>
          {label}
        </Typography>
        <Tooltip title={value} disableHoverListener={value.length < 18}>
          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ lineHeight: 1.3 }}>
            {value}
          </Typography>
        </Tooltip>
        {sub && (
          <Tooltip title={sub} disableHoverListener={sub.length < 25}>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {sub}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </CardContent>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        minWidth: 0,
        flex: "1 1 0",
        display: "flex",
      }}
    >
      {clickable ? (
        <CardActionArea onClick={onClick} sx={{ height: "100%", display: "flex" }}>
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
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 3,
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "grey.400",
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, minWidth: "min-content" }}>
        <SummaryCard
          label="Cost Value"
          value={formatKsh(summary.totalCostValue)}
          sub={`Retail: ${formatKsh(summary.totalRetailValue)}`}
          icon={<TrendingUpOutlined fontSize="small" />}
          color="#9333EA"
        />
        <SummaryCard
          label="In Stock"
          value={summary.totalProducts.toString()}
          icon={<WarehouseOutlined fontSize="small" />}
          color="#2563EB"
        />
        <SummaryCard
          label="Low Stock"
          value={summary.lowStockCount.toString()}
          sub="Click to filter"
          icon={<ReportProblemOutlined fontSize="small" />}
          color="#D97706"
          clickable
          onClick={onLowStockClick}
        />
        <SummaryCard
          label="Out of Stock"
          value={summary.outOfStockCount.toString()}
          sub="Click to filter"
          icon={<Inventory2Outlined fontSize="small" />}
          color="#DC2626"
          clickable
          onClick={onOutOfStockClick}
        />
        <SummaryCard
          label="Most Moved"
          value={summary.mostMovedProduct}
          icon={<TrendingUpOutlined fontSize="small" />}
          color="#16A34A"
        />
      </Box>
    </Box>
  );
}
