import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Notice, StorefrontProduct } from "../storefront.types";

const CART_KEY = "recoil-cart";
const COMPARISON_LIMIT = 3;

type StorefrontContextValue = {
  cart: CartItem[];
  comparison: StorefrontProduct[];
  notice: Notice;
  clearCart: () => void;
  addToCart: (product: StorefrontProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  toggleCompare: (product: StorefrontProduct) => void;
  setNotice: (notice: Notice) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function getStoredCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(getStoredCart);
  const [comparison, setComparison] = useState<StorefrontProduct[]>([]);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const value = useMemo<StorefrontContextValue>(
    () => ({
      cart,
      comparison,
      notice,
      setNotice,
      clearCart: () => setCart([]),
      addToCart: (product) => {
        if (Number(product.itemsInStock) <= 0) {
          setNotice({
            message: "This item is currently out of stock.",
            severity: "error",
          });
          return;
        }
        setCart((items) => {
          const existing = items.find((item) => item.id === product.id);
          if (!existing) return [...items, { ...product, quantity: 1 }];
          return items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    Number(product.itemsInStock),
                  ),
                }
              : item,
          );
        });
        setNotice({
          message: `${product.name} added to your cart.`,
          severity: "success",
        });
      },
      removeFromCart: (productId) =>
        setCart((items) => items.filter((item) => item.id !== productId)),
      updateQuantity: (productId, change) =>
        setCart((items) =>
          items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(Number(item.itemsInStock), item.quantity + change),
                  ),
                }
              : item,
          ),
        ),
      toggleCompare: (product) =>
        setComparison((items) => {
          if (items.some((item) => item.id === product.id))
            return items.filter((item) => item.id !== product.id);
          if (items.length === COMPARISON_LIMIT) {
            setNotice({
              message: "You can compare up to three products.",
              severity: "error",
            });
            return items;
          }
          return [...items, product];
        }),
    }),
    [cart, comparison, notice],
  );

  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context)
    throw new Error("useStorefront must be used inside StorefrontProvider");
  return context;
}
