import { CloseOutlined, RestartAltOutlined, VideocamOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type Props = {
  open: boolean;
  onDetected: (barcode: string) => void;
  onClose: () => void;
};

const FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.AZTEC,
];

let scannerIdCounter = 0;

async function waitForElement(elementId: string, attempts = 20): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i++) {
    const el = document.getElementById(elementId);
    if (el) return el;
    await new Promise((r) => requestAnimationFrame(r));
  }
  return null;
}

export function BarcodeScannerDialog({ open, onDetected, onClose }: Props) {
  const containerIdRef = useRef(`barcode-scanner-${++scannerIdCounter}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const stopPromiseRef = useRef<Promise<void> | null>(null);

  const onDetectedRef = useRef(onDetected);
  useEffect(() => { onDetectedRef.current = onDetected; }, [onDetected]);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    scannerRef.current = null;
    const p = (async () => {
      try { await scanner.stop(); } catch { /* already stopped */ }
      try { scanner.clear(); } catch { /* ignore */ }
    })();
    stopPromiseRef.current = p;
    return p;
  }, []);

  useEffect(() => {
    if (!open) return;
    let active = true;

    (async () => {
      if (stopPromiseRef.current) {
        await stopPromiseRef.current;
        stopPromiseRef.current = null;
      }
      if (!active) return;

      setError(null);
      setLoading(true);

      const element = await waitForElement(containerIdRef.current);
      if (!active) return;
      if (!element) {
        setError("Scanner container not found. Close and reopen the dialog.");
        setLoading(false);
        return;
      }

      const scanner = new Html5Qrcode(containerIdRef.current, {
        formatsToSupport: FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 12,
            qrbox: { width: 260, height: 160 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!active) return;
            onDetectedRef.current(decodedText);
            void stopScanner();
            onCloseRef.current();
          },
          () => { /* per-frame no-detection — normal */ },
        );
        if (!active) {
          await stopScanner();
          return;
        }
        setLoading(false);
      } catch (firstErr: unknown) {
        // Safari often rejects facingMode:"environment" on desktop which
        // has no back camera. Retry once with any available camera.
        try {
          await scanner.start(
            { facingMode: { ideal: "environment" } },
            {
              fps: 12,
              qrbox: { width: 260, height: 160 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              if (!active) return;
              onDetectedRef.current(decodedText);
              void stopScanner();
              onCloseRef.current();
            },
            () => { /* per-frame no-detection — normal */ },
          );
          if (!active) {
            await stopScanner();
            return;
          }
          setLoading(false);
        } catch (secondErr: unknown) {
          if (!active) return;
          const name = (secondErr as { name?: string })?.name;
          const message = (secondErr as { message?: string })?.message || String(secondErr);
          setError(
            name === "NotAllowedError"
              ? "Camera permission denied. Allow camera access in your browser settings, then retry."
              : name === "NotFoundError"
              ? "No camera found on this device."
              : `Camera error: ${message}`,
          );
          setLoading(false);
          await stopScanner();
        }
      }
    })();

    return () => {
      active = false;
      void stopScanner();
    };
  }, [open, retryNonce, stopScanner]);

  function handleClose() {
    onClose();
  }

  function handleRetry() {
    void (async () => {
      await stopScanner();
      setError(null);
      setLoading(true);
      setRetryNonce((n) => n + 1);
    })();
  }

  return (
    <Dialog open={open} onClose={() => {}} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Scan Barcode
        <IconButton size="small" onClick={handleClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <VideocamOutlined sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RestartAltOutlined />}
              onClick={handleRetry}
              size="small"
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ position: "relative", bgcolor: "black" }}>
              <Box
                id={containerIdRef.current}
                sx={{
                  width: "100%",
                  "& video": {
                    width: "100% !important",
                    display: "block",
                    maxHeight: 360,
                    objectFit: "cover",
                    borderRadius: 0,
                    border: "none",
                  },
                }}
              />
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    bgcolor: "rgba(0,0,0,0.6)",
                  }}
                >
                  <CircularProgress sx={{ color: "white" }} />
                  <Typography variant="body2" sx={{ color: "white" }}>
                    Starting camera…
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Point your camera at a barcode to scan
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
