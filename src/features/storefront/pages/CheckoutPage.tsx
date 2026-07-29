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
import { startMpesaCheckout } from "../storefront.api";
import { useStorefront } from "../hooks/useStorefront";
import { money, storeId } from "../storefront.utils";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, setNotice } = useStorefront();
  const [loading, setLoading] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const total = cart.reduce(
    (sum, item) => sum + Number(item.sellingPrice) * item.quantity,
    0,
  );
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const order = await startMpesaCheckout({
        storeId,
        paymentMethod: "MPESA",
        customer: {
          name: String(form.get("name")),
          phone: String(form.get("phone")),
          email: String(form.get("email")) || undefined,
          deliveryAddress: String(form.get("address")),
        },
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      setPendingOrderId(order.orderId);
      if (order.paymentStatus === "PAID") clearCart();
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "We could not start the M-Pesa request.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  if (!cart.length && !pendingOrderId)
    return (
      <main className="empty-state">
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate("/products")}>Browse products</Button>
      </main>
    );
  if (pendingOrderId)
    return (
      <main className="confirmation">
        <div className="confirmation-icon">
          <Check />
        </div>
        <p className="eyebrow">Payment awaiting confirmation</p>
        <h1>Check your phone for the M-Pesa prompt.</h1>
        <p>
          Your order <b>#{pendingOrderId}</b> is pending. We will send your
          confirmation through WhatsApp or SMS only after Daraja confirms the
          payment.
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
          No account needed. Enter your delivery details and we will send an
          M-Pesa prompt to your phone.
        </p>
        <Box component="form" onSubmit={submit} className="checkout-form">
          <TextField label="Full name" name="name" required fullWidth />
          <TextField
            label="M-Pesa phone number"
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
          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              `Pay ${money(total)} with M-Pesa`
            )}
          </Button>
        </Box>
      </div>
      <aside className="order-summary">
        <h2>Your order</h2>
        {cart.map((item) => (
          <div key={item.id}>
            <span>
              {item.quantity} x {item.name}
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
