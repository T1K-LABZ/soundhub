import { CompareArrows } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { money } from "../storefront.utils";
import type { StorefrontProduct } from "../storefront.types";

export function ProductCard({
  product,
  selected,
  onAdd,
  onCompare,
}: {
  product: StorefrontProduct;
  selected: boolean;
  onAdd: (product: StorefrontProduct) => void;
  onCompare: (product: StorefrontProduct) => void;
}) {
  const inStock = Number(product.itemsInStock) > 0;
  const category = product.categoryRef?.name ?? product.category;
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        {product.photoUrl ? (
          <img src={product.photoUrl} alt={product.name} />
        ) : (
          <span>
            RECOIL
            <br />
            <small>{category || "AUDIO"}</small>
          </span>
        )}
        {!inStock && <b className="sold-out">Sold out</b>}
      </Link>
      <div className="product-meta">
        <p>{product.brand ?? category ?? "Recoil Audio"}</p>
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <strong>{money(product.sellingPrice)}</strong>
        <div className="product-actions">
          <Button
            variant="contained"
            disabled={!inStock}
            onClick={() => onAdd(product)}
          >
            Add to cart
          </Button>
          <Tooltip
            title={selected ? "Remove from comparison" : "Compare product"}
          >
            <IconButton
              aria-label={
                selected ? "Remove from comparison" : "Compare product"
              }
              color={selected ? "primary" : "default"}
              onClick={() => onCompare(product)}
            >
              <CompareArrows />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </article>
  );
}
