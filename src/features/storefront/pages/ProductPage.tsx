import { ArrowBack, CompareArrows, LocalShipping } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getStorefrontProduct } from "../storefront.api";
import { useStorefront } from "../hooks/useStorefront";
import { money, storeId, categoryOf } from "../storefront.utils";

export function ProductPage() {
  const { productId = "" } = useParams();
  const navigate = useNavigate();
  const { addToCart, comparison, toggleCompare } = useStorefront();
  const [activeImage, setActiveImage] = useState(0);
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["storefront-product", productId, storeId],
    queryFn: () => getStorefrontProduct(productId, storeId),
    enabled: !!productId && !!storeId,
  });
  if (isLoading)
    return (
      <main className="page-loader">
        <CircularProgress />
      </main>
    );
  if (isError || !product)
    return (
      <main className="empty-state">
        <h2>We could not find this product.</h2>
        <Button onClick={() => navigate("/products")}>Return to shop</Button>
      </main>
    );
  const images = [
    ...new Set([product.photoUrl, ...(product.images ?? [])].filter(Boolean)),
  ] as string[];
  const specs = product.specifications?.length
    ? product.specifications
    : [
        ["Brand", product.brand ?? "Recoil"],
        ["Category", categoryOf(product)],
        [
          "Availability",
          Number(product.itemsInStock) > 0 ? "In stock" : "Out of stock",
        ],
        ["SKU", product.barcode || "Available on request"],
      ].map(([label, value]) => ({ label, value }));
  return (
    <main className="product-page">
      <Link to="/products" className="back-link">
        <ArrowBack /> Back to shop
      </Link>
      <div className="detail-grid">
        <div>
          <div className="detail-image">
            {images.length ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <span>
                RECOIL
                <br />
                <small>ENGINEERED FOR SOUND</small>
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  aria-label={`View product image ${index + 1}`}
                  className={index === activeImage ? "active" : ""}
                  key={image}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{categoryOf(product)}</p>
          <h1>{product.name}</h1>
          <h2>{money(product.sellingPrice)}</h2>
          <p
            className={
              Number(product.itemsInStock) > 0 ? "stock in" : "stock out"
            }
          >
            {Number(product.itemsInStock) > 0
              ? "In stock and ready to ship"
              : "Currently out of stock"}
          </p>
          <p>
            {product.description ||
              "Precision-engineered Recoil audio equipment for a sharper, more powerful listening experience."}
          </p>
          <div className="detail-actions">
            <Button
              variant="contained"
              size="large"
              disabled={Number(product.itemsInStock) <= 0}
              onClick={() => addToCart(product)}
            >
              Add to cart
            </Button>
            <Button
              variant="outlined"
              startIcon={<CompareArrows />}
              onClick={() => toggleCompare(product)}
            >
              {comparison.some((item) => item.id === product.id)
                ? "Added to compare"
                : "Compare"}
            </Button>
          </div>
          <div className="delivery-note">
            <LocalShipping /> Nairobi delivery available. Nationwide shipping at
            checkout.
          </div>
        </div>
      </div>
      <section className="spec-section">
        <p className="eyebrow">Technical details</p>
        <h2>Product specifications</h2>
        <div className="spec-grid">
          {specs.map((spec) => (
            <div key={spec.label}>
              <span>{spec.label}</span>
              <b>{spec.value}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
