import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { changePassword } from "./auth.api";
import { useAuthStore } from "./auth.store";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = newPassword.length >= 8 && passwordsMatch && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, mustChangePassword: false }, accessToken, refreshToken);
      }
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.dashboard, { replace: true }), 1500);
    } catch {
      setError("Failed to change password. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "#F70000",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#fff" sx={{ mb: 1 }}>
          Password updated
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
          Taking you to your dashboard…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Box
            component="img"
            src="/images/soundhublogo.png"
            alt="SoundHub"
            sx={{ height: 40, mb: 3 }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Change your password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For security, please set a new password before continuing.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="New password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            size="small"
            autoFocus
            error={newPassword.length > 0 && newPassword.length < 8}
            helperText={
              newPassword.length > 0 && newPassword.length < 8
                ? "Password must be at least 8 characters"
                : " "
            }
            sx={{ mb: 2.5 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={showNew ? "Hide password" : "Show password"}
                      onClick={() => setShowNew((v) => !v)}
                      edge="end"
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Confirm password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            size="small"
            error={confirmPassword.length > 0 && !passwordsMatch}
            helperText={
              confirmPassword.length > 0 && !passwordsMatch
                ? "Passwords do not match"
                : " "
            }
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!canSubmit}
            sx={{ py: 1.2, borderRadius: 2 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
