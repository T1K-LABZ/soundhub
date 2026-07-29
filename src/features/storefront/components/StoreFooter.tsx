import { Link } from "react-router-dom";

const whatsappNumber = import.meta.env.VITE_STOREFRONT_WHATSAPP_NUMBER;

export function StoreFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <img src="/images/recoil-logo.png" alt="Recoil Audio Kenya" />
        <p>
          Official Recoil Audio distributor in Kenya. Genuine sound, local
          expertise.
        </p>
      </div>
      <div>
        <h3>Shop</h3>
        <Link to="/products">All products</Link>
        <Link to="/products?category=Amplifiers">Amplifiers</Link>
        <Link to="/products?category=Subwoofers">Subwoofers</Link>
      </div>
      <div>
        <h3>Support</h3>
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        )}
        <a href="mailto:sales@recoil.ke">sales@recoil.ke</a>
        <span>Kenya-wide delivery</span>
      </div>
      <small>
        © {new Date().getFullYear()} Recoil Audio Kenya. All rights reserved.
      </small>
    </footer>
  );
}
