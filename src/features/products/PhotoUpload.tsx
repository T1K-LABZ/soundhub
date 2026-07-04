import { AddAPhotoOutlined, CloseOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useRef } from "react";

type Props = {
  preview: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
};

export function PhotoUpload({ preview, onFileChange, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      {preview ? (
        <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }}
          />
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 3,
            gap: 1,
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          <AddAPhotoOutlined sx={{ color: "text.secondary", fontSize: 32 }} />
          <Typography variant="body2" color="text.secondary">
            Upload product image
          </Typography>
        </Box>
      )}
    </Box>
  );
}
