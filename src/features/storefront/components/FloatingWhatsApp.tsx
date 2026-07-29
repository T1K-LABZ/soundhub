import { WhatsApp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const whatsappNumber = import.meta.env.VITE_STOREFRONT_WHATSAPP_NUMBER;

export function FloatingWhatsApp() {
  if (!whatsappNumber) return null;

  const message = encodeURIComponent(
    "Hi Recoil Kenya, I would like help choosing car audio equipment.",
  );

  return (
    <Tooltip title="Chat with Recoil Kenya on WhatsApp" placement="left">
      <a
        className="floating-whatsapp"
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Recoil Kenya on WhatsApp"
      >
        <WhatsApp />
      </a>
    </Tooltip>
  );
}
