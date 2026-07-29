import { Search, ShoppingBagOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useStorefrontCategories } from "../pages/useStorefrontProducts";

export function StoreHeader({
  onCart,
  cartCount,
}: {
  onCart: () => void;
  cartCount: number;
}) {
  const { data: categories = [] } = useStorefrontCategories();
  const preferredCategories = ["Amplifier", "Speaker", "Subwoofer"];
  const navigationCategories = preferredCategories
    .map((name) =>
      categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      ),
    )
    .filter((category): category is (typeof categories)[number] =>
      Boolean(category),
    );

  return (
    <>
      <div className="shipping-strip">
        Free Nairobi delivery on orders above KSh 10,000
      </div>
      <header className="store-header">
        <Link to="/" className="brand">
          <img src="/images/recoil-logo.png" alt="Recoil Audio Kenya" />
        </Link>
        <nav>
          {(navigationCategories.length
            ? navigationCategories
            : categories.slice(0, 3)
          ).map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
          <Link to="/products">Shop all</Link>
        </nav>
        <div className="header-actions">
          <Link to="/products" aria-label="Search products">
            <Search />
          </Link>
          <IconButton onClick={onCart} aria-label="Open cart">
            <ShoppingBagOutlined />
            <span className="cart-count">{cartCount}</span>
          </IconButton>
        </div>
      </header>
    </>
  );
}
