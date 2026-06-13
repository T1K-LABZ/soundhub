import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  BULK_SEGMENTS,
  OFFER_CHANNELS,
  OFFER_TYPES,
} from "./customers.constants";
import type { Customer, OfferChannel, SendOfferForm } from "./customers.types";

type Props = {
  open: boolean;
  // Single customer mode when set; bulk mode when null
  customer: Customer | null;
  onClose: () => void;
};

const EMPTY: SendOfferForm = {
  title: "",
  offerType: "Discount %",
  message: "",
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: "",
  channels: ["Whatsapp"],
  targetSegment: "All Customers",
};

export function SendOfferModal({ open, customer, onClose }: Props) {
  const [form, setForm] = useState<SendOfferForm>({ ...EMPTY });

  function set<K extends keyof SendOfferForm>(k: K, v: SendOfferForm[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function toggleChannel(ch: OfferChannel) {
    const cur = form.channels;
    set(
      "channels",
      cur.includes(ch) ? cur.filter((c) => c !== ch) : [...cur, ch],
    );
  }

  // Replace {name} token in preview
  const previewName = customer?.fullName.split(" ")[0] ?? "Customer";
  const previewMessage = form.message
    .replace("{name}", previewName)
    .replace("{car}", customer?.vehicles[0]?.plate ?? "your car");

  const isValid =
    form.title.trim() !== "" &&
    form.message.trim() !== "" &&
    form.validUntil !== "";

  function handleSend() {
    console.log("Send offer:", { customer: customer?.id, form });
    setForm({ ...EMPTY });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
    >
      <DialogTitle>
        {customer ? `Send Offer — ${customer.fullName}` : "Bulk Campaign"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Offer Title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              fullWidth
              required
              placeholder="e.g. VIP Exclusive Deal"
              autoFocus
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Offer Type"
              value={form.offerType}
              onChange={(e) =>
                set("offerType", e.target.value as SendOfferForm["offerType"])
              }
              fullWidth
            >
              {OFFER_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            {/* Bulk only */}
            {!customer && (
              <TextField
                select
                label="Target Segment"
                value={form.targetSegment}
                onChange={(e) => set("targetSegment", e.target.value)}
                fullWidth
              >
                {BULK_SEGMENTS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Message"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
              placeholder="Hi {name}! 🎉 We have a special offer just for you..."
              helperText={`Use {name} and {car} for personalisation · ${form.message.length} chars`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Valid From"
              type="date"
              value={form.validFrom}
              onChange={(e) => set("validFrom", e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Valid Until"
              type="date"
              value={form.validUntil}
              onChange={(e) => set("validUntil", e.target.value)}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          {/* Channel selection */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Send via
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {OFFER_CHANNELS.map((ch) => (
                <FormControlLabel
                  key={ch}
                  control={
                    <Checkbox
                      size="small"
                      checked={form.channels.includes(ch)}
                      onChange={() => toggleChannel(ch)}
                    />
                  }
                  label={ch}
                />
              ))}
            </Box>
          </Grid>

          {/* Whatsapp-style preview */}
          {form.message && (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.5}
              >
                Message Preview
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "#dcfce7",
                  maxWidth: 300,
                  borderRadius: 3,
                  borderTopLeftRadius: 0,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="#16A34A"
                  mb={0.5}
                >
                  🔊 AutoSound Pro
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {previewMessage || "Your message will appear here…"}
                </Typography>
                {form.validUntil && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={0.5}
                  >
                    Valid until: {form.validUntil}
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="outlined" onClick={handleSend} disabled={!isValid}>
          Schedule for Later
        </Button>
        <Button variant="contained" onClick={handleSend} disabled={!isValid}>
          Send Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
