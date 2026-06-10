import {
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
        {/* Stock value card */}
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

        {/* Movement card */}
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

        {/* Line chart */}
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

      {/* 3 tables row */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Low Stock */}
        <Card
          sx={{
            flex: "1 1 30%",
            minWidth: 220,
            borderRadius: 2,
            border: "1.5px solid #D97706",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="#D97706"
              sx={{ mb: 1 }}
            >
              ⚠️ Low Stock ({lowStock.length})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    Qty
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    ROP
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStock.map((p) => (
                  <TableRow key={p.productId} hover>
                    <TableCell sx={{ fontSize: 11, p: "4px 8px" }}>
                      {p.productName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 11,
                        p: "4px 8px",
                        color: "#D97706",
                        fontWeight: 700,
                      }}
                    >
                      {p.quantityOnHand}
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, p: "4px 8px" }}>
                      {p.reorderPoint}
                    </TableCell>
                  </TableRow>
                ))}
                {lowStock.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        fontSize: 11,
                        textAlign: "center",
                        color: "text.disabled",
                      }}
                    >
                      None
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card
          sx={{
            flex: "1 1 30%",
            minWidth: 220,
            borderRadius: 2,
            border: "1.5px solid #DC2626",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="#DC2626"
              sx={{ mb: 1 }}
            >
              🚫 Out of Stock ({outOfStock.length})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    ROP
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outOfStock.map((p) => (
                  <TableRow key={p.productId} hover>
                    <TableCell sx={{ fontSize: 11, p: "4px 8px" }}>
                      {p.productName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 11,
                        p: "4px 8px",
                        color: "#DC2626",
                        fontWeight: 700,
                      }}
                    >
                      {p.reorderPoint}
                    </TableCell>
                  </TableRow>
                ))}
                {outOfStock.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        fontSize: 11,
                        textAlign: "center",
                        color: "text.disabled",
                      }}
                    >
                      None
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Most Stocked */}
        <Card
          sx={{
            flex: "1 1 30%",
            minWidth: 220,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              📦 Most Stocked
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: 11, p: "4px 8px" }}
                  >
                    Qty
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostStocked.map((p) => (
                  <TableRow key={p.productId} hover>
                    <TableCell sx={{ fontSize: 11, p: "4px 8px" }}>
                      {p.productName}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 11, p: "4px 8px", fontWeight: 700 }}
                    >
                      {p.quantityOnHand}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
