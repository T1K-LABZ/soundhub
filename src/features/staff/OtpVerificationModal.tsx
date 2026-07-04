import { CheckCircleOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { verifyOtp } from "./staff.api";

type Props = {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerified: () => void;
};

export function OtpVerificationModal({ open, phone, onClose, onVerified }: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      setSuccess(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  function handleChange(index: number, value: string) {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verifyOtp(phone, code);
      setSuccess(true);
      setTimeout(() => onVerified(), 1500);
    } catch {
      setError("Invalid code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {success ? "Phone Verified" : "Verify Phone Number"}
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        {success ? (
          <Box sx={{ py: 2 }}>
            <CheckCircleOutlined sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography variant="body1" fontWeight={600}>
              Phone number verified successfully
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The staff member can now log in with their credentials.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit code sent via SMS to{" "}
              <strong>{phone}</strong>
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                mb: 2,
              }}
            >
              {otp.map((digit, i) => (
                <TextField
                  key={i}
                  inputRef={(el) => { inputRefs.current[i] = el; }}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      padding: "8px 0",
                      width: "2ch",
                    },
                  }}
                  sx={{ width: 48 }}
                  error={!!error}
                />
              ))}
            </Box>

            {error && (
              <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            sx={{ textTransform: "none" }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
