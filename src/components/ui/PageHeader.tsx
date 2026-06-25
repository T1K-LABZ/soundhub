import { Box, Typography } from "@mui/material";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: subtitle ? 0.5 : 0,
        }}
      >
        <Typography variant={{ xs: "h5", sm: "h4" }} fontWeight={700} sx={{ minWidth: 0 }}>
          {title}
        </Typography>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
      {subtitle && (
        <Typography variant={{ xs: "body2", sm: "body1" }} color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
