import { CompareArrows } from "@mui/icons-material";
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartDrawer } from "./components/CartDrawer";
import { CompareDialog } from "./components/CompareDialog";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { StoreFooter } from "./components/StoreFooter";
import { StoreHeader } from "./components/StoreHeader";
import { StorefrontProvider, useStorefront } from "./hooks/useStorefront";
import { CataloguePage } from "./pages/CataloguePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import "./storefront.css";

export function StorefrontApp() {
  return (
    <BrowserRouter>
      <StorefrontProvider>
        <StorefrontShell />
      </StorefrontProvider>
    </BrowserRouter>
  );
}

function StorefrontShell() {
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const { cart, comparison, notice, setNotice } = useStorefront();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <StoreHeader cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<CataloguePage />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <StoreFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} />
      <FloatingWhatsApp />
      {comparison.length > 0 && (
        <Button
          className="compare-float"
          startIcon={<CompareArrows />}
          onClick={() => setCompareOpen(true)}
        >
          Compare {comparison.length}
        </Button>
      )}
      <Snackbar
        open={!!notice}
        autoHideDuration={3500}
        onClose={() => setNotice(null)}
      >
        <Alert severity={notice?.severity}>{notice?.message}</Alert>
      </Snackbar>
    </>
  );
}
