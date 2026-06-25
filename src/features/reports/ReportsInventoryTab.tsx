import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type {
  InventoryProduct,
  StockMovement,
} from "../inventory/inventory.types";
import { buildStockMovementPoints } from "../inventory/inventory.data";
import { formatKsh } from "./reports.utils";

type Props = {
  products: InventoryProduct[];
  movements: StockMovement[];
};

export function ReportsInventoryTab({ products, movements }: Props) {
  const totalCostValue = products.reduce(
    (s, p) => s + p.buyingPrice * p.quantityOnHand,
    0,
  );
  const totalRetailValue = products.reduce(
    (s, p) => s + p.sellingPrice * p.quantityOnHand,
    0,
  );
  const totalMovements = movements.length;
  const stockInQty = movements
    .filter((m) => m.movementType === "Stock In")
    .reduce((s, m) => s + Math.abs(m.quantity), 0);
  const stockOutQty = movements
    .filter((m) => m.movementType === "Stock Out")
    .reduce((s, m) => s + Math.abs(m.quantity), 0);

  const chartData = buildStockMovementPoints(movements, "30D", "");

  const lowStock = products.filter(
    (p) => p.quantityOnHand > 0 && p.quantityOnHand <= p.reorderPoint,
  );
  const outOfStock = products.filter((p) => p.quantityOnHand === 0);
  const mostStocked = [...products]
    .sort((a, b) => b.quantityOnHand - a.quantityOnHand)
    .slice(0, 5);

  return (
    <Box>
      {/* Stat cards + chart row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: "0 0 200px",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Stock Cost Value
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
              {formatKsh(totalCostValue)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Retail: {formatKsh(totalRetailValue)}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "0 0 200px",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Stock Movements (30d)
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
              {totalMovements} events
            </Typography>
            <Typography variant="caption" color="text.secondary">
              In: {stockInQty} · Out: {stockOutQty}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 340px",
            minWidth: 260,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Stock Movement (30 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="stockIn"
                  name="Stock In"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="stockOut"
                  name="Stock Out"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Stock alerts - card grid */}
      <Grid container spacing={2}>
        {/* Low Stock */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              border: "1.5px solid #D97706",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="#D97706"
                sx={{ mb: 1.5 }}
              >
                Low Stock ({lowStock.length})
              </Typography>
              {lowStock.length === 0 ? (
                <Typography variant="caption" color="text.disabled">
                  None
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {lowStock.map((p) => (
                    <Box
                      key={p.productId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        bgcolor: "#fffbeb",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                        {p.productName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
                        <Typography variant="caption" color="#D97706" fontWeight={700}>
                          {p.quantityOnHand} in stock
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ROP: {p.reorderPoint}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Out of Stock */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              border: "1.5px solid #DC2626",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="#DC2626"
                sx={{ mb: 1.5 }}
              >
                Out of Stock ({outOfStock.length})
              </Typography>
              {outOfStock.length === 0 ? (
                <Typography variant="caption" color="text.disabled">
                  None
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {outOfStock.map((p) => (
                    <Box
                      key={p.productId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        bgcolor: "#fef2f2",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                        {p.productName}
                      </Typography>
                      <Typography variant="caption" color="#DC2626" fontWeight={700}>
                        ROP: {p.reorderPoint}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Most Stocked */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Most Stocked
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {mostStocked.map((p) => (
                  <Box
                    key={p.productId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                      {p.productName}
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {p.quantityOnHand} units
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
