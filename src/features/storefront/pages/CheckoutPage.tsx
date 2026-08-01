import { Check } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { placeOrder } from "../storefront.api";
import { useStorefront } from "../hooks/useStorefront";
import { money, storeId } from "../storefront.utils";
import type { PlaceOrderResponse } from "../storefront.types";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, setNotice } = useStorefront();
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] =
    useState<PlaceOrderResponse | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.sellingPrice) * item.quantity,
    0,
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const order = await placeOrder({
        storeId,
        customerName: String(form.get("name")),
        customerPhone: String(form.get("phone")),
        customerEmail: String(form.get("email")) || undefined,
        deliveryAddress: String(form.get("address")),
        notes: String(form.get("notes")) || undefined,
        products: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: Number(item.sellingPrice),
          lineTotal: Number(item.sellingPrice) * item.quantity,
        })),
        totalAmount: total,
      });

      setConfirmedOrder(order);
      clearCart();
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "We could not place your order. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Empty cart and no confirmed order yet
  if (!cart.length && !confirmedOrder)
    return (
      <main className="empty-state">
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate("/products")}>Browse products</Button>
      </main>
    );

  // Order placed successfully
  if (confirmedOrder)
    return (
      <main className="confirmation">
        <div className="confirmation-icon">
          <Check />
        </div>
        <p className="eyebrow">Order placed successfully</p>
        <h1>Thank you, {confirmedOrder.customerName.split(" ")[0]}!</h1>
        <p>
          Your order <b>#{confirmedOrder.id}</b> has been received and is{" "}
          <b>{confirmedOrder.status}</b>. We will contact you via WhatsApp or
          call to confirm delivery details.
        </p>
        <Button component={Link} to="/products" variant="contained">
          Continue shopping
        </Button>
      </main>
    );

  return (
    <main className="checkout">
      <div>
        <p className="eyebrow">Guest checkout</p>
        <h1>Almost there.</h1>
        <p>
          No account needed. Enter your details and we will get your order
          ready.
        </p>
        <Box component="form" onSubmit={submit} className="checkout-form">
          <TextField label="Full name" name="name" required fullWidth />
          <TextField
            label="Phone number"
            name="phone"
            placeholder="07XX XXX XXX"
            required
            fullWidth
          />
          <TextField
            label="Email address (optional)"
            name="email"
            type="email"
            fullWidth
          />
          <TextField
            label="Delivery address"
            name="address"
            required
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Notes (optional)"
            name="notes"
            placeholder="e.g. Call before delivery"
            fullWidth
            multiline
            minRows={2}
          />
          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              `Place Order — ${money(total)}`
            )}
          </Button>
        </Box>
      </div>

      <aside className="order-summary">
        <h2>Your order</h2>
        {cart.map((item) => (
          <div key={item.id}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <b>{money(Number(item.sellingPrice) * item.quantity)}</b>
          </div>
        ))}
        <Divider />
        <div className="total">
          <span>Total</span>
          <b>{money(total)}</b>
        </div>
      </aside>
    </main>
  );
}
