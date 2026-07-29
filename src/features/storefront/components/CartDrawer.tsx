import {
  Add,
  Close,
  Delete,
  Remove,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { Button, Drawer, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStorefront } from "../hooks/useStorefront";
import { money } from "../storefront.utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useStorefront();
  const total = cart.reduce(
    (sum, item) => sum + Number(item.sellingPrice) * item.quantity,
    0,
  );
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ className: "cart-drawer" }}
    >
      <div className="drawer-head">
        <h2>Your cart</h2>
        <IconButton onClick={onClose} aria-label="Close cart">
          <Close />
        </IconButton>
      </div>
      {cart.length ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-thumb">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt="" />
                  ) : (
                    "RECOIL"
                  )}
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{money(item.sellingPrice)}</p>
                  <div className="quantity">
                    <IconButton
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Remove />
                    </IconButton>
                    <span>{item.quantity}</span>
                    <IconButton
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <small>Delivery charges are confirmed during checkout.</small>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
            >
              Checkout with M-Pesa
            </Button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <ShoppingBagOutlined />
          <h3>Your cart is empty</h3>
          <Button onClick={onClose}>Continue shopping</Button>
        </div>
      )}
    </Drawer>
  );
}
