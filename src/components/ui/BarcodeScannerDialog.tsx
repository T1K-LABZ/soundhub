import { BrowserMultiFormatReader } from "@zxing/browser";
import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onDetected: (barcode: string) => void;
  onClose: () => void;
};

/**
 * Opens the device camera and continuously scans for barcodes/QR codes.
 * Think of it like a motion detector — it stays watching until it sees something,
 * then fires once and hands the result back to the parent.
 */
export function BarcodeScannerDialog({ open, onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    setError(null);
    setLoading(true);

    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
        if (result) {
          onDetected(result.getText());
          stopScanner();
        }
        // err fires on every frame with no barcode — that's normal, ignore it
        if (err && err.name !== "NotFoundException") {
          setError("Camera error. Please try again.");
          setLoading(false);
        }
      })
      .then(() => setLoading(false))
      .catch(() => {
        setError("Could not access camera. Check permissions and try again.");
        setLoading(false);
      });

    return () => stopScanner();
  }, [open]);

  function stopScanner() {
    BrowserMultiFormatReader.releaseAllStreams();
    readerRef.current = null;
  }

  function handleClose() {
    stopScanner();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Scan Barcode
        <IconButton size="small" onClick={handleClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative", bgcolor: "black" }}>
            {/* Live camera feed */}
            <video
              ref={videoRef}
              style={{
                width: "100%",
                display: "block",
                maxHeight: 360,
                objectFit: "cover",
              }}
            />

            {/* Loading overlay while camera initialises */}
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

            {/* Scan target overlay */}
            {!loading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Box
                  sx={{
                    width: 220,
                    height: 120,
                    border: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Point your camera at a barcode to scan
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
