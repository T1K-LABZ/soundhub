import { keyframes } from "@emotion/react";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { login } from "./auth.api";
import { useAuthStore } from "./auth.store";

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

type Step = "form" | "loading" | "success";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        navigate(ROUTES.dashboard, { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStep("loading");

    try {
      const { user, accessToken, refreshToken, status } = await login({
        email,
        password,
      });
      setAuth(user, accessToken, refreshToken);
      if (status === "PASSWORD_CHANGE_REQUIRED") {
        navigate(ROUTES.changePassword, { replace: true });
      } else {
        setStep("success");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
      setStep("form");
    }
  }

  const isSuccess = step === "success";
  const isFormVisible = step === "form" || step === "loading";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Brand panel */}
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "#F70000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          order: { xs: 0, md: 0 },
          overflow: "hidden",
          position: "relative",
          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          // Mobile: absolute fill on success, 35vh otherwise; Desktop: width
          ...(isSuccess
            ? {
                height: "100vh",
                width: "100%",
                position: "absolute",
                inset: 0,
                zIndex: 10,
              }
            : {
                height: { xs: "35vh", md: "100%" },
                width: { xs: "100%", md: 440 },
              }),
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)",
          },
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "#fff",
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            mb: isSuccess ? 4 : 2,
            p: 2,
            position: "relative",
            transition: "all 0.6s ease",
            animation: isSuccess
              ? `${breathe} 1.5s ease-in-out infinite`
              : "none",
          }}
        >
          <Box
            component="img"
            src="/images/soundhublogo.png"
            alt="SoundHub"
            sx={{
              height: isSuccess ? 64 : 48,
              objectFit: "contain",
              transition: "height 0.6s ease",
            }}
          />
        </Box>

        {isSuccess ? (
          <>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#fff"
              sx={{
                animation: `${fadeIn} 0.5s 0.2s both`,
                position: "relative",
                textAlign: "center",
              }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                animation: `${fadeIn} 0.5s 0.4s both`,
                color: "rgba(255,255,255,0.75)",
                mt: 1,
                position: "relative",
                textAlign: "center",
              }}
            >
              Taking you to your dashboard…
            </Typography>
          </>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.75)",
              mt: 0.5,
              position: "relative",
              textAlign: "center",
            }}
          >
            Inventory & management, simplified.
          </Typography>
        )}
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "background.default",
          display: "flex",
          flex: 1,
          justifyContent: "center",
          order: { xs: 1, md: 1 },
          overflow: "hidden",
          p: { xs: 3, md: 4 },
          // Mobile: fade + slide down; Desktop: fade only
          opacity: isSuccess ? 0 : 1,
          pointerEvents: isSuccess ? "none" : "auto",
          transform: {
            xs: isSuccess ? "translateY(40px)" : "translateY(0)",
            md: "none",
          },
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your SoundHub account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              size="small"
              autoComplete="email"
              autoFocus
              disabled={!isFormVisible}
              sx={{ mb: 2.5 }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              size="small"
              autoComplete="current-password"
              disabled={!isFormVisible}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
              disabled={step !== "form" || !email || !password}
              sx={{ py: 1.2, borderRadius: 2 }}
            >
              {step === "loading" ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
