import { Box, Typography } from "@mui/material";

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          flex: "1 1 320px",
        }}
      >
        {title && (
          <Typography
            variant={{ xs: "h5", sm: "h4" }}
            fontWeight={700}
            sx={{ minWidth: 0, mb: subtitle ? 0.5 : 0 }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant={{ xs: "body2", sm: "body1" }} color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
