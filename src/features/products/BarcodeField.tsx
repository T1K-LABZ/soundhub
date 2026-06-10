import { QrCodeScannerOutlined } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useState } from "react";
import { BarcodeScannerDialog } from "../../components/ui/BarcodeScannerDialog";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function BarcodeField({ value, onChange }: Props) {
  const [scannerOpen, setScannerOpen] = useState(false);

  function handleDetected(barcode: string) {
    onChange(barcode);
    setScannerOpen(false);
  }

  return (
    <>
      <TextField
        label="Barcode"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        placeholder="Scan or type barcode…"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Scan barcode with camera">
                  <IconButton
                    onClick={() => setScannerOpen(true)}
                    edge="end"
                    size="small"
                  >
                    <QrCodeScannerOutlined />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />

      <BarcodeScannerDialog
        open={scannerOpen}
        onDetected={handleDetected}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}
