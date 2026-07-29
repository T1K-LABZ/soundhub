import {
  Check,
  ChevronRight,
  LocalShipping,
  WhatsApp,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import RippleGrid from "../components/RippleGrid";
import {
  useStorefrontGallery,
  useStorefrontProducts,
} from "./useStorefrontProducts";

export function HomePage() {
  const { data = [], isLoading } = useStorefrontProducts();
  const { data: gallery = [] } = useStorefrontGallery("Subwoofer");
  const [activeImage, setActiveImage] = useState(0);
  const categories = ["Amplifiers", "Speakers", "Subwoofers", "Accessories"];

  useEffect(() => {
    if (gallery.length < 2) return;
    const interval = window.setInterval(
      () => setActiveImage((current) => (current + 1) % gallery.length),
      4500,
    );
    return () => window.clearInterval(interval);
  }, [gallery.length]);
  return (
    <main>
      <section className="hero">
        <div className="hero-ripple" aria-hidden="true">
          <RippleGrid
            enableRainbow={false}
            gridColor="#009CE8"
            rippleIntensity={0.05}
            gridSize={10}
            gridThickness={15}
            mouseInteraction
            mouseInteractionRadius={0.8}
            opacity={1}
            fadeDistance={1.5}
            vignetteStrength={2}
            glowIntensity={0.1}
            gridRotation={0}
          />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Official Recoil Audio distributor in Kenya</p>
          <h1>Power your drive.</h1>
          <p>High-performance car audio, built for the road ahead.</p>
          <Button component={Link} to="/products" variant="contained">
            Shop Recoil <ChevronRight />
          </Button>
        </div>
        <div
          className="hero-gallery"
          aria-label="Featured Recoil audio products"
        >
          {gallery.length ? (
            gallery.map((product, index) => (
              <img
                className={index === activeImage ? "active" : ""}
                src={product.photoUrl}
                alt={product.name}
                key={product.id}
              />
            ))
          ) : (
            <div className="hero-product">
              <b>RECOIL</b>
              <small>ENGINEERED FOR SOUND</small>
            </div>
          )}
          {gallery.length > 1 && (
            <div className="hero-gallery-label">
              <span>Featured gear</span>
              <b>{gallery[activeImage]?.name}</b>
            </div>
          )}
        </div>
      </section>
      <section className="category-band">
        <div className="section-heading">
          <p className="eyebrow">Find your setup</p>
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              className={`category-tile tile-${index}`}
              to={`/products?category=${category}`}
              key={category}
            >
              <span>0{index + 1}</span>
              <strong>{category}</strong>
              <ChevronRight />
            </Link>
          ))}
        </div>
      </section>
      <section className="product-shelf">
        <div className="shelf-heading">
          <div>
            <p className="eyebrow">Recoil Kenya</p>
            <h2>Built for serious sound</h2>
            <p>Shop the gear that turns every drive into an experience.</p>
          </div>
          <Button component={Link} to="/products" endIcon={<ChevronRight />}>
            View all
          </Button>
        </div>
        <ProductGrid products={data.slice(0, 4)} isLoading={isLoading} />
      </section>
      <section className="promise">
        <div>
          <LocalShipping />
          <h3>Delivery you can count on</h3>
          <p>Fast, tracked delivery across Kenya.</p>
        </div>
        <div>
          <Check />
          <h3>Genuine Recoil gear</h3>
          <p>Official products, backed by local support.</p>
        </div>
        <div>
          <WhatsApp />
          <h3>Need installation advice?</h3>
          <p>Talk to a Recoil specialist on WhatsApp.</p>
        </div>
      </section>
    </main>
  );
}
