import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProductStat } from "./reports.types";
import { CATEGORY_COLOR } from "./reports.constants";
import { formatKsh } from "./reports.utils";

type Props = { productStats: ProductStat[] };

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "#f59e0b",
    2: "#94a3b8",
    3: "#b45309",
  };
  const bg = colors[rank] ?? "#334155";
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        bgcolor: bg,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {rank}
    </Box>
  );
}

function ProductCard({ product }: { product: ProductStat }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <RankBadge rank={product.rank} />
          <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ flex: 1 }}>
            {product.productName}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              fontSize: 10,
              height: 18,
              bgcolor: (CATEGORY_COLOR[product.category] ?? "#94a3b8") + "22",
              color: CATEGORY_COLOR[product.category] ?? "#94a3b8",
              fontWeight: 600,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {product.brand}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Units Sold</Typography>
          <Typography variant="caption" fontWeight={700}>{product.unitsSold}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Revenue</Typography>
          <Typography variant="caption" fontWeight={700}>{formatKsh(product.revenue)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Avg Price</Typography>
          <Typography variant="caption">{formatKsh(product.avgPrice)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">Stock Left</Typography>
          <Typography
            variant="caption"
            fontWeight={700}
            color={
              product.stockLeft === 0
                ? "#DC2626"
                : product.stockLeft <= 3
                  ? "#D97706"
                  : "text.primary"
            }
          >
            {product.stockLeft}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function ReportsProductsTab({ productStats }: Props) {
  const top10 = productStats.slice(0, 10);

  const catMap: Record<string, { units: number; revenue: number }> = {};
  for (const p of productStats) {
    if (!catMap[p.category]) catMap[p.category] = { units: 0, revenue: 0 };
    catMap[p.category].units += p.unitsSold;
    catMap[p.category].revenue += p.revenue;
  }
  const catData = Object.entries(catMap).map(([name, v]) => ({
    name,
    value: v.revenue,
  }));

  const deadStock = productStats.filter(
    (p) => p.unitsSold === 0 && p.stockLeft > 0,
  );

  return (
    <Box>
      {/* Top 10 bar chart + category donut row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: "1 1 55%",
            minWidth: 280,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Top 10 Products by Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="productName"
                  tick={{ fontSize: 9 }}
                  width={130}
                  tickFormatter={(v: string) =>
                    v.split(" ").slice(0, 3).join(" ")
                  }
                />
                <Tooltip
                  formatter={(v: number, name: string) => [
                    name === "revenue" ? formatKsh(v) : v,
                    name,
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                  {top10.map((p) => (
                    <Cell
                      key={p.productName}
                      fill={CATEGORY_COLOR[p.category] ?? "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 38%",
            minWidth: 240,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Revenue by Category
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={catData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {catData.map((e) => (
                    <Cell
                      key={e.name}
                      fill={CATEGORY_COLOR[e.name] ?? "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatKsh(v)}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Product cards grid */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Product Performance
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {top10.map((p) => (
          <Grid key={p.productName} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>

      {/* Dead stock alert */}
      {deadStock.length > 0 && (
        <Card sx={{ borderRadius: 2, border: "1.5px solid #D97706" }}>
          <CardContent>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="#D97706"
              sx={{ mb: 1 }}
            >
              Dead Stock Alert — {deadStock.length} products with 0 sales
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {deadStock.map((p) => (
                <Chip
                  key={p.productName}
                  label={`${p.productName} (${p.stockLeft} units)`}
                  size="small"
                  sx={{ bgcolor: "#fff3cd", color: "#D97706", fontSize: 11 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
